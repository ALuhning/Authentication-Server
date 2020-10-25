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
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_websocket_1 = __importDefault(require("koa-websocket"));
const fs_1 = require("fs");
const dotenv_1 = __importDefault(require("dotenv"));
const userwss_1 = __importDefault(require("./userwss"));
const appwss_1 = __importDefault(require("./appwss"));
const enckey_1 = __importDefault(require("./enckey"));
const api_1 = __importDefault(require("./api"));
dotenv_1.default.config();
if (!process.env.USER_API_KEY ||
    !process.env.USER_API_SECRET) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10) || 3001;
const app = koa_websocket_1.default(new koa_1.default());
/** Middlewares */
app.use(koa_json_1.default());
app.use(koa_logger_1.default());
app.use(koa_bodyparser_1.default());
/* Not safe in production */
//app.use(cors());
app.use(koa_static_1.default(__dirname + '/client'));
/**
 * Start HTTP Routes
 */
const router = new koa_router_1.default();
app.use(router.routes()).use(router.allowedMethods());
/**
 * Serve index.html
 */
router.get('/', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = fs_1.createReadStream(__dirname + '/client/index.html');
    yield next();
}));
/**
 * Create Rest endpoint for server-side token issue
 *
 * See ./api.ts
 */
app.use(api_1.default.routes());
app.use(api_1.default.allowedMethods());
/**
 * Create Websocket endpoint for client-side token challenge
 *
 * See ./wss.ts
 */
app.ws.use(userwss_1.default);
app.ws.use(appwss_1.default);
app.ws.use(enckey_1.default);
/** Start the server! */
app.listen(PORT, () => console.log("Server started."));
//# sourceMappingURL=index.js.map