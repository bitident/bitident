import { Request, Response, } from 'express';
const express = require("express")
export const checkApp = express()
const cors = require('cors')
checkApp.use(cors())

import { firestore, } from 'firebase-admin'
import { ok } from 'assert'

const db = firestore();

const requestRef = db.collection('request');

checkApp.get("**/:id", async (request: Request, response: Response) => {
    const id = request.params.id
    try {
        ok(id, 'ID_MISSING')

        const requestRecord = await requestRef.doc(id).get()

        const requestData = requestRecord.data()
        if (requestRecord === undefined) {
            throw Error('ERR_REQUEST_NOT_FOUND')
        }
        if(requestData && requestData.tsig){
            return response.json({success: 1})
        } else {
            return response.json({success: 0})
        }

    } catch (error) {
        response.status(500)
        switch (error.message) {
            case 'ERR_REQUEST_NOT_FOUND':
                return response.send(error.message)
        }
        console.error(error)
        return response.send('INTERNAL_ERROR')
    }
})