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
const koa_router_1 = __importDefault(require("koa-router"));
const hub_helpers_1 = require("./hub-helpers");
/**
 * Start API Routes
 *
 * All prefixed with `/api/`
 */
const api = new koa_router_1.default({
    prefix: '/api'
});
/**
 * Create a REST API endpoint at /api/auth
 *
 * This endpoint will provide authorization for _any_ user.
 */
api.get('/userauth', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    /** Get API authorization for the user */
    const auth = yield hub_helpers_1.getAPISig();
    /** Include the token in the auth payload */
    const credentials = Object.assign(Object.assign({}, auth), { key: process.env.USER_API_KEY });
    /** Return the auth in a JSON object */
    ctx.body = credentials;
    yield next();
}));
api.get('/appauth', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    /** Get API authorization for the user */
    const auth = yield hub_helpers_1.getAppAPISig();
    /** Include the token in the auth payload */
    const credentials = Object.assign(Object.assign({}, auth), { key: process.env.ORG_API_KEY });
    /** Return the auth in a JSON object */
    ctx.body = credentials;
    yield next();
}));
api.get('/enckey', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    /** Get API authorization for the user */
    const auth = yield hub_helpers_1.getAPISig();
    /** Include the token in the auth payload */
    const encKeyCredentials = Object.assign(Object.assign({}, auth), { key: process.env.USER_API_KEY });
    /** Return the auth in a JSON object */
    ctx.body = encKeyCredentials;
    yield next();
}));
exports.default = api;
//# sourceMappingURL=api.js.map