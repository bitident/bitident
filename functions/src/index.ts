import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

import { createApp } from './api/create';
import { checkApp } from './api/check';
import { confirmApp } from './api/confirm';

export const create = functions.https.onRequest(createApp)

export const check = functions.https.onRequest(checkApp)

export const confirm = functions.https.onRequest(confirmApp)