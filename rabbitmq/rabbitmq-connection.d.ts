import { RabbitMQConnectionOptions, RabbitMQMessage, RabbitMQPublishMessageOptions, RabbitMQRegisterExchangeOptions } from "./types";
export declare class RabbitMQConnection {
    private _conn;
    private _options;
    private _exchangeSenders;
    private _exchangeReceivers;
    constructor(options: RabbitMQConnectionOptions);
    private _checkExistedConnection;
    private _encryptMessageForSender;
    private _decryptMessageForReceiver;
    private _addExchangeSender;
    private _removeExchangeSender;
    private _removeAllExchangeSender;
    private _checkExistedExchangeSender;
    private _addExchangeReceiver;
    private _removeExchangeReceiver;
    private _removeAllExchangeReceiver;
    private _checkExistedExchangeReceiver;
    connect(): Promise<boolean>;
    registerExchangeSender(options: RabbitMQRegisterExchangeOptions): Promise<boolean>;
    registerExchangeReceiver(options: RabbitMQRegisterExchangeOptions): Promise<boolean>;
    publishMessage(exchangeId: string, msg: RabbitMQMessage, options?: RabbitMQPublishMessageOptions): Promise<boolean>;
    closeConnection(): void;
}
