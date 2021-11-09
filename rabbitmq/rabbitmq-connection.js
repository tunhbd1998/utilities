"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConnection = void 0;
const amqp = __importStar(require("amqplib"));
const ramda_1 = require("ramda");
class RabbitMQConnection {
    constructor(options) {
        this._options = options;
        this._exchangeSenders = {};
        this._exchangeReceivers = {};
    }
    _checkExistedConnection() {
        if (this._conn) {
            return true;
        }
        console.error("RabbitMQConnection: Not establish connection");
        return false;
    }
    _encryptMessageForSender(msgWrapper) {
        return JSON.stringify(msgWrapper);
    }
    _decryptMessageForReceiver(encryptedString) {
        return JSON.parse(encryptedString);
    }
    _addExchangeSender(id, channel) {
        console.log("RabbitMQConnection: Add exchange sender", id);
        this._exchangeSenders[id] = channel;
    }
    _removeExchangeSender(id) {
        console.log("RabbitMQConnection: Remove exchange sender", id);
        if (this._exchangeSenders[id]) {
            this._exchangeSenders[id].channel.close();
            this._exchangeSenders[id] = undefined;
        }
    }
    _removeAllExchangeSender() {
        console.log("RabbitMQConnection: Remove all exchange sender");
        for (const id in this._exchangeSenders) {
            this._removeExchangeSender(id);
        }
    }
    _checkExistedExchangeSender(id) {
        if (this._exchangeSenders[id]) {
            return true;
        }
        console.error("RabbitMQConnection: Not register exchange sender with id " + id);
        return false;
    }
    _addExchangeReceiver(id, channel) {
        console.log("RabbitMQConnection: Add exchange receiver", id);
        this._exchangeReceivers[id] = channel;
    }
    _removeExchangeReceiver(id) {
        console.log("RabbitMQConnection: remove exchange receiver", id);
        if (this._exchangeReceivers[id]) {
            this._exchangeReceivers[id].channel.close();
            this._exchangeReceivers[id] = undefined;
        }
    }
    _removeAllExchangeReceiver() {
        console.log("RabbitMQConnection: Add all exchange receiver");
        for (const id in this._exchangeReceivers) {
            this._removeExchangeReceiver(id);
        }
    }
    _checkExistedExchangeReceiver(id) {
        if (this._exchangeReceivers[id]) {
            return true;
        }
        console.error("RabbitMQConnection: Not register exchange receiver with id " + id);
        return false;
    }
    connect() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("RabbitMQConnection: Connect");
            this._conn = yield amqp
                .connect({
                hostname: this._options.hostName,
                port: this._options.port,
                username: (_a = this._options) === null || _a === void 0 ? void 0 : _a.username,
                password: (_b = this._options) === null || _b === void 0 ? void 0 : _b.password,
                vhost: (_c = this._options) === null || _c === void 0 ? void 0 : _c.vHost,
            })
                .then((conn) => {
                console.log("RabbitMQConnection: Successfully Connection!!!");
                return conn;
            })
                .catch((err) => {
                console.error(err);
                return null;
            });
            if (this._conn) {
                return true;
            }
            return false;
        });
    }
    registerExchangeSender(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("RabbitMQConnection: Register exchange sender", options);
            if (this._checkExistedConnection()) {
                if (this._checkExistedExchangeSender(options.id)) {
                    return true;
                }
                const channel = yield this._conn.createChannel().catch((err) => {
                    throw err;
                });
                if (!channel) {
                    return false;
                }
                channel.assertExchange(options.exchange, options.transferType, Object.assign({ durable: (options === null || options === void 0 ? void 0 : options.durable) || false }, ((options === null || options === void 0 ? void 0 : options.others) || {})));
                console.log(`RabbitMQConnection: Register exchange sender "${options.id}" successfully`);
                this._addExchangeSender(options.id, {
                    id: options.id,
                    channel,
                    exchange: options.exchange,
                    queues: [],
                    transferType: options.transferType,
                });
                return true;
            }
            return false;
        });
    }
    registerExchangeReceiver(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("RabbitMQConnection: Register exchange receiver", options);
            if (this._checkExistedConnection()) {
                if (this._checkExistedExchangeReceiver(options.id)) {
                    return true;
                }
                const channel = yield this._conn.createChannel().catch((err) => {
                    throw err;
                });
                if (!channel) {
                    return false;
                }
                if ((options === null || options === void 0 ? void 0 : options.messageQuantityPerTime) > 0) {
                    yield channel.prefetch(options === null || options === void 0 ? void 0 : options.messageQuantityPerTime);
                }
                channel.assertExchange(options.exchange, options.transferType, Object.assign({ durable: (options === null || options === void 0 ? void 0 : options.durable) || false }, ((options === null || options === void 0 ? void 0 : options.others) || {})));
                for (const queue of (options === null || options === void 0 ? void 0 : options.queues) || []) {
                    const q = yield channel.assertQueue(queue.name, {
                        durable: (options === null || options === void 0 ? void 0 : options.durable) || false,
                    });
                    if (q) {
                        yield channel
                            .bindQueue(queue.name, options === null || options === void 0 ? void 0 : options.exchange, (queue === null || queue === void 0 ? void 0 : queue.routing) || "")
                            .catch((err) => {
                            console.error(err);
                        });
                        channel.consume(queue.name, (msg) => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            if ((queue === null || queue === void 0 ? void 0 : queue.consumeOptions.func) &&
                                typeof (queue === null || queue === void 0 ? void 0 : queue.consumeOptions.func) === "function" &&
                                msg) {
                                const msgWrapperContent = msg.content.toString();
                                const _c = this._decryptMessageForReceiver(msgWrapperContent), { currentScheduling, publishOptions = {} } = _c, ceMsg = __rest(_c, ["currentScheduling", "publishOptions"]);
                                console.log("RabbitMQConnection: Receive message", Object.assign({ currentScheduling,
                                    publishOptions }, ceMsg));
                                if (!(yield (queue === null || queue === void 0 ? void 0 : queue.consumeOptions.func(ceMsg)))) {
                                    if ((ceMsg === null || ceMsg === void 0 ? void 0 : ceMsg.maximumOfRescheduling) === -1 ||
                                        currentScheduling - 1 < ((ceMsg === null || ceMsg === void 0 ? void 0 : ceMsg.maximumOfRescheduling) || 0)) {
                                        console.log("RabbitMQConnection: Rescheduling message");
                                        channel.publish(options === null || options === void 0 ? void 0 : options.exchange, queue === null || queue === void 0 ? void 0 : queue.routing, Buffer.from(this._encryptMessageForSender(Object.assign({ currentScheduling: currentScheduling + 1, publishOptions }, ceMsg))), Object.assign(Object.assign({ persistent: (publishOptions === null || publishOptions === void 0 ? void 0 : publishOptions.persistent) || false }, ((publishOptions === null || publishOptions === void 0 ? void 0 : publishOptions.others) || {})), { headers: Object.assign(Object.assign({}, (((_b = publishOptions === null || publishOptions === void 0 ? void 0 : publishOptions.others) === null || _b === void 0 ? void 0 : _b.headers) || {})), { "x-delay": (ceMsg === null || ceMsg === void 0 ? void 0 : ceMsg.reschedulingAfter) || 0 }) }));
                                    }
                                }
                            }
                            if ((options === null || options === void 0 ? void 0 : options.delayBeforeAck) > 0) {
                                setTimeout(() => {
                                    channel.ack(msg);
                                }, options === null || options === void 0 ? void 0 : options.delayBeforeAck);
                            }
                            else {
                                channel.ack(msg);
                            }
                        }), Object.assign({ noAck: false }, (((_a = queue === null || queue === void 0 ? void 0 : queue.consumeOptions) === null || _a === void 0 ? void 0 : _a.others) || {})));
                    }
                }
                console.log(`RabbitMQConnection: Register exchange receiver "${options.id}" successfully`);
                this._addExchangeReceiver(options.id, {
                    id: options.id,
                    channel,
                    exchange: options.exchange,
                    queues: options.queues,
                    transferType: options.transferType,
                });
                return true;
            }
            return false;
        });
    }
    publishMessage(exchangeId, msg, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("RabbitMQConnection: Publish message", {
                exchangeId,
                msg,
                options,
            });
            if (this._checkExistedExchangeSender(exchangeId)) {
                const { channel, exchange } = this._exchangeSenders[exchangeId];
                const msgWrapper = Object.assign(Object.assign({}, msg), { currentScheduling: 1, publishOptions: (0, ramda_1.pick)(["persistent", "others"], options || {}) });
                return channel.publish(exchange, (options === null || options === void 0 ? void 0 : options.routing) || "", Buffer.from(this._encryptMessageForSender(msgWrapper)), Object.assign(Object.assign({ persistent: (options === null || options === void 0 ? void 0 : options.persistent) || false }, ((options === null || options === void 0 ? void 0 : options.others) || {})), { headers: Object.assign(Object.assign({}, (((_a = options === null || options === void 0 ? void 0 : options.others) === null || _a === void 0 ? void 0 : _a.headers) || {})), { "x-delay": (options === null || options === void 0 ? void 0 : options.delay) || 0 }) }));
            }
            return false;
        });
    }
    closeConnection() {
        console.log("RabbitMQConnection: Close connection");
        if (this._conn) {
            this._removeAllExchangeSender();
            this._removeAllExchangeReceiver();
            this._conn.close();
            this._conn = null;
        }
    }
}
exports.RabbitMQConnection = RabbitMQConnection;
