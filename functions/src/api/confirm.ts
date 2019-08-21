import { Request, Response, } from 'express';
const express = require("express")
const requestify = require('requestify');
export const confirmApp = express()
const cors = require('cors')
confirmApp.use(cors())
import { firestore, } from 'firebase-admin'
import { ok } from 'assert'
const { Request, Message } = require('bitident')

const db = firestore();

const requestRef = db.collection('request');

confirmApp.post("**/:id", async (request: Request, response: Response) => {
    const id = request.params.id
    const signature = request.body.signature
    try {
        ok(id, 'ID_MISSING')

        const requestRecord = await requestRef.doc(id).get()

        const requestData = requestRecord.data()
        if (requestRecord === undefined) {
            throw Error('ERR_REQUEST_NOT_FOUND')
        } else if (requestData) {
            switch (requestData.status) {
                case 'complete':
                case 'expired':
                    return response.json({
                        status: requestData.status()
                    })
            }
        }
        const tokenString = requestData ? requestData.encoded : ''

        await verifyToken(tokenString, signature)

        await requestRef.doc(id).update({
            tsig: signature,
            status: 'complete',
        })

        return response.json({
            ...requestData,
            tsig: signature,
        })

    } catch (error) {
        response.status(500)
        switch (error.message) {
            case 'ERR_EXPIRED':
                await requestRef.doc(id).update({
                    status: 'expired',
                })
            case 'ERR_REQUEST_NOT_FOUND':
            case 'ERR_FUTURE_TIME':
            case 'ERR_INVALID_SIGNATURE':
                return response.send(error.message)
        }
        console.error(error)
        return response.send('INTERNAL_ERROR')
    }
})

async function verifyToken(token: string, targetSignature: string) {
    console.info('check signature', targetSignature, ' for token', token)
    const tokenData = Request.decode(token, 'hex')

    if (tokenData.time > Date.now()) {
        throw Error('ERR_FUTURE_TIME')
    }
    if ((tokenData.time + tokenData.timeout) * 1000 < Date.now()) {
        throw Error('ERR_EXPIRED')
    }

    const address = await requestify.get('https://explorer.mvs.org/api/avatar/' + tokenData['target'])
        .then((result: any) => {
            const res = result.getBody()
            if (res.result) {
                return res.result.address
            }
            throw Error('ERR_TARGET_AVATAR_NOT_FOUND')
        })
        .catch((error: any) => {
            switch (error.message) {
                case 'ERR_TARGET_AVATAR_NOT_FOUND':
                    throw Error(error.message);
            }
            console.log('cannot load avatar', error)
            throw Error('ERR_VALIDATE_TARGET_AVATAR')
        })

    if (!Message.verify(token, address, targetSignature, tokenData.target)) {
        throw Error('ERR_INVALID_SIGNATURE')
    }
    return true
}