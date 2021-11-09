import * as amqp from "amqplib";

export type TransferType =
  | "direct"
  | "fanout"
  | "topic"
  | "headers"
  | "x-delayed-message";

export type RabbitMQConnectionOptions = {
  /**
   * hostname
   */
  hostName: string;
  /**
   * port
   */
  port: number;
  /**
   * username
   */
  username?: string;
  /**
   * password
   */
  password?: string;
  /**
   * virtual host
   * Default: /
   */
  vHost?: string;
};

export type RabbitMQMessage = {
  message: string;
  data?: any;
  maximumOfRescheduling?: number;
  reschedulingAfter?: number;
};

export type RabbitMQMessageWrapper = {
  currentScheduling?: number;
  publishOptions?: {
    persistent?: boolean;
    others?: amqp.Options.Publish;
  };
} & RabbitMQMessage;

export type RabbitMQPublishMessageOptions = {
  routing?: string;
  persistent?: boolean;
  delay?: number;
  others?: amqp.Options.Publish;
};

export type RabbitMQQueue = {
  name: string;
  routing?: string;
  consumeOptions: {
    func: (msg: RabbitMQMessage) => boolean | Promise<boolean>;
    others?: amqp.Options.Consume;
  };
};

export type RabbitMQRegisterExchangeOptions = {
  id: string;
  exchange: string;
  transferType: TransferType;
  durable?: boolean;
  queues?: RabbitMQQueue[];
  messageQuantityPerTime?: number;
  delayBeforeAck?: number;
  others?: amqp.Options.AssertExchange;
};

export type RabbitMQExchangeChannel = {
  id: string;
  exchange: string;
  queues: RabbitMQQueue[];
  transferType: TransferType;
  channel: amqp.Channel;
};
