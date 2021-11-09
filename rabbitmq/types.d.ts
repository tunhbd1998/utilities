import * as amqp from "amqplib";
export declare type TransferType = "direct" | "fanout" | "topic" | "headers" | "x-delayed-message";
export declare type RabbitMQConnectionOptions = {
    hostName: string;
    port: number;
    username?: string;
    password?: string;
    vHost?: string;
};
export declare type RabbitMQMessage = {
    message: string;
    data?: any;
    maximumOfRescheduling?: number;
    reschedulingAfter?: number;
};
export declare type RabbitMQMessageWrapper = {
    currentScheduling?: number;
    publishOptions?: {
        persistent?: boolean;
        others?: amqp.Options.Publish;
    };
} & RabbitMQMessage;
export declare type RabbitMQPublishMessageOptions = {
    routing?: string;
    persistent?: boolean;
    delay?: number;
    others?: amqp.Options.Publish;
};
export declare type RabbitMQQueue = {
    name: string;
    routing?: string;
    consumeOptions: {
        func: (msg: RabbitMQMessage) => boolean | Promise<boolean>;
        others?: amqp.Options.Consume;
    };
};
export declare type RabbitMQRegisterExchangeOptions = {
    id: string;
    exchange: string;
    transferType: TransferType;
    durable?: boolean;
    queues?: RabbitMQQueue[];
    messageQuantityPerTime?: number;
    delayBeforeAck?: number;
    others?: amqp.Options.AssertExchange;
};
export declare type RabbitMQExchangeChannel = {
    id: string;
    exchange: string;
    queues: RabbitMQQueue[];
    transferType: TransferType;
    channel: amqp.Channel;
};
