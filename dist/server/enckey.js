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
const enckey = koa_route_1.default.all('/ws/enckey', (ctx) => {
    /** Emittery allows us to wait for the challenge response event */
    ctx.websocket.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            /** All messages from client contain {type: string} */
            const data = JSON.parse(msg.toString());
            switch (data.type) {
                case 'enckey':
                    {
                        /** A new token request will contain the user's public key */
                        if (!data.pubkey) {
                            throw new Error('missing pubkey');
                        }
                        /** Include the token in the auth payload */
                        const payload = {
                            pubkey: data.pub,
                            enckey: process.env.ENC_KEY
                        };
                        const returnData = {
                            type: 'enckey',
                            value: payload
                        };
                        /** Return the result to the client */
                        ctx.websocket.send(JSON.stringify(returnData));
                        break;
                    }
                    ctx.websocket.close();
            }
        }
        catch (error) {
            /** Notify our client of any errors */
            ctx.websocket.send(JSON.stringify({
                type: 'error',
                value: error.message,
            }));
            ctx.websocket.close();
        }
    }));
});
exports.default = enckey;
//# sourceMappingURL=enckey.js.map