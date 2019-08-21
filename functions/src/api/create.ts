import { Request, Response, } from 'express';
const express = require("express")
const requestify = require('requestify');
export const createApp = express()
const cors = require('cors')
createApp.use(cors())
import { firestore, } from 'firebase-admin';
import { config } from 'firebase-functions';
import { ok } from 'assert';

const { Request, Message } = require('bitident')

const db = firestore();

const requestRef = db.collection('request');

const sourceAvatar = config().metaverse.avatar
const sourceCallbackUrl = 'https://bitident.com/api/confirm/'

createApp.post("*", async (request: Request, response: Response) => {
    const avatar = request.body.avatar
    try {


        ok(avatar, 'AVATAR_MISSING')

        /*
         * Check if the user should be able to create a new request.
         * In case of a 2ta you should for example check the primary
         * login credentials first.
         */

        // Verify avatar exists
        await requestify.get('https://explorer.mvs.org/api/avatar/' + avatar)
            .then((result: any) => {
                const res = result.getBody()
                if (res.result) {
                    return res.result
                }
                throw Error('ERR_AVATAR_NOT_FOUND')
            })
            .catch((error: any) => {
                console.log('cannot load avatar', error)
                throw Error('ERR_VALIDATE_AVATAR')
            })

        const requestRecord = await requestRef.doc()

        const token = new Request({
            source: sourceAvatar,
            time: Math.floor(Date.now() / 1000),
            timeout: 300,
            callback: sourceCallbackUrl + requestRecord.id,
            target: avatar,
            type: 'auth',
            network: 'mainnet',
            version: 1
        })

        // sign the request
        token.sourceSignature = Message.signWIF(token.encode('hex'), config().metaverse.wif, config().metaverse.avatar).toString('hex')

        await requestRecord.create({
            token: JSON.parse(JSON.stringify(token)),
            encoded: token.encode('hex')
        })
            .catch(error => {
                console.error(error)
                throw Error('ERR_CREATE_REQUEST')
            })

        return response.json({
            token: token.encode('hex'),
            id: requestRecord.id,
        })

    } catch (error) {
        response.status(500)
        switch (error.message) {
            case 'ERR_VALIDATE_AVATAR':
            case 'ERR_AVATAR_NOT_FOUND':
            case 'ERR_CREATE_REQUEST':
                return response.send(error.message)
        }
        console.error(error)
        return response.send('INTERNAL_ERROR')
    }
})

