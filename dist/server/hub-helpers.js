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
Object.defineProperty(exports, "__esModule", { value: true });
exports.newAppClientDB = exports.newClientDB = exports.getAppAPISig = exports.getAPISig = void 0;
const hub_1 = require("@textile/hub");
/**
 * getAPISig uses helper function to create a new sig
 *
 * seconds (300) time until the sig expires
 */
exports.getAPISig = (seconds = 300) => __awaiter(void 0, void 0, void 0, function* () {
    const expiration = new Date(Date.now() + 1000 * seconds);
    return yield hub_1.createAPISig(process.env.USER_API_SECRET, expiration);
});
exports.getAppAPISig = (seconds = 300) => __awaiter(void 0, void 0, void 0, function* () {
    const expiration = new Date(Date.now() + 1000 * seconds);
    return yield hub_1.createAPISig(process.env.ORG_API_SECRET, expiration);
});
/**
 * newClientDB creates a Client (remote DB) connection to the Hub
 *
 * A Hub connection is required to use the getToken API
 */
exports.newClientDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const API = process.env.API || undefined;
    const db = yield hub_1.Client.withKeyInfo({
        key: process.env.USER_API_KEY,
        secret: process.env.USER_API_SECRET
    }, API);
    return db;
});
exports.newAppClientDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const API = process.env.API || undefined;
    const db = yield hub_1.Client.withKeyInfo({
        key: process.env.ORG_API_KEY,
        secret: process.env.ORG_API_SECRET
    }, API);
    return db;
});
//# sourceMappingURL=hub-helpers.js.map