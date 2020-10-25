"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_route_1 = __importDefault(require("koa-route"));
const emittery_1 = __importDefault(require("emittery"));
const hub_helpers_1 = require("./hub-helpers");
/**
 * In a real system you might have a real user-singup flow
 * Here, we just stub in a basic user "database".
 * Users are added by their Public Key.
 * Users will only be added if they prove they hold the private key.
 * Proof is done using the Hub's built in token challenge API.
 */
const UserDB = {};
/**
 * This login includes a more thorough identity verification step.
 *
 * It leverages the Hub's public key verification via challenge.
 * The challenge is issued server-side by fulfilled here, client-side.
 * This has several benefits.
 * - User private key never needs to leave the user/client.
 * - The server will leverage the Hub verification in the process of user registration.
 * - The server can maintain a record of: user public key and user token in list of users.
 */
const wss = koa_route_1.default.all('/ws/userauth', (ctx) => {
    /** Emittery allows us to wait for the challenge response event */
    const emitter = new emittery_1.default();
    ctx.websocket.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            /** All messages from client contain {type: string} */
            const data = JSON.parse(msg);
            switch (data.type) {
                /** The first type is a new token request */
                case 'token': {
                    /** A new token request will contain the user's public key */
                    if (!data.pubkey) {
                        throw new Error('missing pubkey');
                    }
                    /**
                     * Init new Hub API Client
                     *
                     * see ./hub.ts
                     */
                    const db = yield hub_helpers_1.newClientDB();
                    /** Request a token from the Hub based on the user public key */
                    const token = yield db.getTokenChallenge(data.pubkey, 
                    /** The callback passes the challenge back to the client */
                    (challenge) => {
                        return new Promise((resolve, reject) => {
                            /** Pass the challenge to the client */
                            ctx.websocket.send(JSON.stringify({
                                type: 'challenge',
                                value: Buffer.from(challenge).toJSON(),
                            }));
                            /** Wait for the challenge event from our event emitter */
                            emitter.on('challenge', (sig) => {
                                /** Resolve the promise with the challenge response */
                                resolve(Buffer.from(sig));
                            });
                            /** Give client a reasonable timeout to respond to the challenge */
                            setTimeout(() => {
                                reject();
                            }, 1500);
                        });
                    });
                    /**
                     * The challenge was successfully completed by the client
                     */
                    /**
                     * The user has verified they own the pubkey.
                     * Add or update the user in the user database
                     */
                    const user = {
                        pubkey: data.pub,
                        lastSeen: new Date(),
                    };
                    UserDB[data.pub] = user;
                    /** Get API authorization for the user */
                    const auth = yield hub_helpers_1.getAPISig();
                    /** Include the token in the auth payload */
                    const payload = Object.assign(Object.assign({}, auth), { token: token, key: process.env.USER_API_KEY });
                    /** Return the result to the client */
                    ctx.websocket.send(JSON.stringify({
                        type: 'token',
                        value: payload,
                    }));
                    break;
                }
                /** The second type is a challenge response */
                case 'challenge': {
                    /** A new challenge response will contain a signature */
                    if (!data.sig) {
                        throw new Error('missing signature (sig)');
                    }
                    /**
                     * If the timeout hasn't passed there is a waiting promise.
                     * Emit the challenge signature for the waiting listener above.
                     * */
                    yield emitter.emit('challenge', data.sig);
                    break;
                }
            }
        }
        catch (error) {
            /** Notify our client of any errors */
            ctx.websocket.send(JSON.stringify({
                type: 'error',
                value: error.message,
            }));
        }
    }));
});
exports.default = wss;
//# sourceMappingURL=wss.js.map