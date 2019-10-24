import { Request, Response, } from 'express';
const express = require("express")
const requestify = require('requestify');
export const confirmApp = express()
const cors = require('cors')
confirmApp.use(cors())
import { firestore, } from 'firebase-admin'
import { ok } from 'assert'
import { Token } from '../interface/token';
const { Request, Message } = require('bitident')

const db = firestore();

const requestRef = db.collection('request');

confirmApp.post("**/:id", async (request: Request, response: Response) => {
    const id = request.params.id
    const receivedTokenString = request.body.token

    try {

        ok(typeof receivedTokenString === 'string', 'ERR_SIGNATURE_FORMAT')

        let receivedToken: Token;
        try {
            receivedToken = Request.decode(receivedTokenString, 'hex')
        } catch (error){
            throw Error('ERR_DECODINNG_TOKEN');
        }
        ok(id, 'ERR_ID_MISSING')
        ok(receivedToken.targetSignature, 'ERR_SIGNATURE_MISSING')

        // Get the request from the database - dont take it from the user
        const requestRecord = await requestRef.doc(id).get()
        const requestData = requestRecord.data()
        if (requestRecord === undefined) {
            throw Error('ERR_REQUEST_NOT_FOUND')
        } else if (requestData) {
            // check if the status of the request is valid
            switch (requestData.status) {
                case 'complete':
                case 'expired':
                    console.info(`token not active. status: ${requestData.status}`)
                    return response.json({
                        status: requestData.status
                    })
            }
        }
        // verify the encoded token
        const tokenString = requestData ? requestData.encoded : ''

        console.info('check signature', receivedToken.targetSignature, ' for token', tokenString)
        const originToken: Token = Request.decode(tokenString, 'hex');
        originToken.targetSignature=receivedToken.targetSignature
        if(originToken.target===''&&receivedToken.target!==''){
            originToken.target=receivedToken.target;
        }
        await verifyTargetSignature(originToken)
        console.info('signature verified')

        // update the status on the database
        await requestRef.doc(id).update({
            tsig: receivedToken.targetSignature,
            avatar: receivedToken.target,
            status: 'complete',
        })

        return response.json({
            target: receivedToken.target
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
            case 'ERR_DECODING_TOKEN':
            case 'ERR_ID_MISSING':
            case 'ERR_SIGNATURE_MISSING':
            case 'ERR_INVALID_SIGNATURE':
            case 'ERR_SIGNATURE_FORMAT':
                console.log(error)
                return response.send(error.message)
        }
        console.error(error)
        return response.send('INTERNAL_ERROR')
    }
})

async function verifyTargetSignature(token: Token) {


    if (token.time > Date.now()) {
        throw Error('ERR_FUTURE_TIME')
    }
    if ((token.time + token.timeout) * 1000 < Date.now()) {
        throw Error('ERR_EXPIRED')
    }
    console.info(`token time still valid ${token.time} with timeout of ${token.timeout}s`)

    const avatar = token.target
    ok(avatar, 'ERR_TARGET_NOT_SET');

    const address = await requestify.get('https://explorer.mvs.org/api/avatar/' + avatar)
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
    console.log(`avatar ${avatar} has address ${address}`)

    const targetSignature = token.targetSignature
    token.sourceSignature=''
    token.targetSignature=''

    const checkToken = new Request(token)

    if (!Message.verify(checkToken.encode('hex'), address, targetSignature, avatar)) {
        throw Error('ERR_INVALID_SIGNATURE')
    }
    return true
}