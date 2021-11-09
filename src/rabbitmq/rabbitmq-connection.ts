import * as amqp from "amqplib";
import { pick } from "ramda";
import {
  RabbitMQConnectionOptions,
  RabbitMQExchangeChannel,
  RabbitMQMessage,
  RabbitMQMessageWrapper,
  RabbitMQPublishMessageOptions,
  RabbitMQRegisterExchangeOptions,
} from "./types";

export class RabbitMQConnection {
  private _conn: amqp.Connection;
  private _options: RabbitMQConnectionOptions;
  private _exchangeSenders: {
    [id: string]: RabbitMQExchangeChannel;
  };
  private _exchangeReceivers: {
    [id: string]: RabbitMQExchangeChannel;
  };

  constructor(options: RabbitMQConnectionOptions) {
    this._options = options;
    this._exchangeSenders = {};
    this._exchangeReceivers = {};
  }

  private _checkExistedConnection() {
    if (this._conn) {
      return true;
    }

    console.error("RabbitMQConnection: Not establish connection");
    return false;
  }

  private _encryptMessageForSender(msgWrapper: RabbitMQMessageWrapper) {
    return JSON.stringify(msgWrapper);
  }

  private _decryptMessageForReceiver(
    encryptedString: string
  ): RabbitMQMessageWrapper {
    return JSON.parse(encryptedString);
  }

  /* ===== Manage exchange sender - BEGIN ===== */
  private _addExchangeSender(id: string, channel: RabbitMQExchangeChannel) {
    console.log("RabbitMQConnection: Add exchange sender", id);
    this._exchangeSenders[id] = channel;
  }

  private _removeExchangeSender(id: string) {
    console.log("RabbitMQConnection: Remove exchange sender", id);

    if (this._exchangeSenders[id]) {
      this._exchangeSenders[id].channel.close();
      this._exchangeSenders[id] = undefined;
    }
  }

  private _removeAllExchangeSender() {
    console.log("RabbitMQConnection: Remove all exchange sender");

    for (const id in this._exchangeSenders) {
      this._removeExchangeSender(id);
    }
  }

  private _checkExistedExchangeSender(id: string) {
    if (this._exchangeSenders[id]) {
      return true;
    }

    console.error(
      "RabbitMQConnection: Not register exchange sender with id " + id
    );
    return false;
  }
  /* ===== Manage exchange sender - END ===== */

  /* ===== Manage exchange receiver - BEGIN ===== */
  private _addExchangeReceiver(id: string, channel: RabbitMQExchangeChannel) {
    console.log("RabbitMQConnection: Add exchange receiver", id);
    this._exchangeReceivers[id] = channel;
  }

  private _removeExchangeReceiver(id: string) {
    console.log("RabbitMQConnection: remove exchange receiver", id);

    if (this._exchangeReceivers[id]) {
      this._exchangeReceivers[id].channel.close();
      this._exchangeReceivers[id] = undefined;
    }
  }

  private _removeAllExchangeReceiver() {
    console.log("RabbitMQConnection: Add all exchange receiver");

    for (const id in this._exchangeReceivers) {
      this._removeExchangeReceiver(id);
    }
  }

  private _checkExistedExchangeReceiver(id: string) {
    if (this._exchangeReceivers[id]) {
      return true;
    }

    console.error(
      "RabbitMQConnection: Not register exchange receiver with id " + id
    );
    return false;
  }
  /* ===== Manage exchange receiver - END ===== */

  async connect() {
    console.log("RabbitMQConnection: Connect");
    this._conn = await amqp
      .connect({
        hostname: this._options.hostName,
        port: this._options.port,
        username: this._options?.username,
        password: this._options?.password,
        vhost: this._options?.vHost,
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
  }

  async registerExchangeSender(options: RabbitMQRegisterExchangeOptions) {
    console.log("RabbitMQConnection: Register exchange sender", options);
    if (this._checkExistedConnection()) {
      if (this._checkExistedExchangeSender(options.id)) {
        return true;
      }

      const channel = await this._conn.createChannel().catch((err) => {
        throw err;
      });

      if (!channel) {
        return false;
      }

      channel.assertExchange(options.exchange, options.transferType, {
        durable: options?.durable || false,
        ...(options?.others || {}),
      });

      console.log(
        `RabbitMQConnection: Register exchange sender "${options.id}" successfully`
      );
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
  }

  async registerExchangeReceiver(options: RabbitMQRegisterExchangeOptions) {
    console.log("RabbitMQConnection: Register exchange receiver", options);
    if (this._checkExistedConnection()) {
      if (this._checkExistedExchangeReceiver(options.id)) {
        return true;
      }

      const channel = await this._conn.createChannel().catch((err) => {
        throw err;
      });

      if (!channel) {
        return false;
      }

      if (options?.messageQuantityPerTime > 0) {
        await channel.prefetch(options?.messageQuantityPerTime);
      }

      channel.assertExchange(options.exchange, options.transferType, {
        durable: options?.durable || false,
        ...(options?.others || {}),
      });

      for (const queue of options?.queues || []) {
        const q = await channel.assertQueue(queue.name, {
          durable: options?.durable || false,
        });

        if (q) {
          await channel
            .bindQueue(queue.name, options?.exchange, queue?.routing || "")
            .catch((err) => {
              console.error(err);
            });
          channel.consume(
            queue.name,
            async (msg) => {
              if (
                queue?.consumeOptions.func &&
                typeof queue?.consumeOptions.func === "function" &&
                msg
              ) {
                const msgWrapperContent = msg.content.toString();
                const {
                  currentScheduling,
                  publishOptions = {},
                  ...ceMsg
                } = this._decryptMessageForReceiver(msgWrapperContent);
                console.log("RabbitMQConnection: Receive message", {
                  currentScheduling,
                  publishOptions,
                  ...ceMsg,
                });

                if (!(await queue?.consumeOptions.func(ceMsg))) {
                  if (
                    ceMsg?.maximumOfRescheduling === -1 ||
                    currentScheduling - 1 < (ceMsg?.maximumOfRescheduling || 0)
                  ) {
                    console.log("RabbitMQConnection: Rescheduling message");

                    channel.publish(
                      options?.exchange,
                      queue?.routing,
                      Buffer.from(
                        this._encryptMessageForSender({
                          currentScheduling: currentScheduling + 1,
                          publishOptions,
                          ...ceMsg,
                        })
                      ),
                      {
                        persistent: publishOptions?.persistent || false,
                        ...(publishOptions?.others || {}),
                        headers: {
                          ...(publishOptions?.others?.headers || {}),
                          "x-delay": ceMsg?.reschedulingAfter || 0,
                        },
                      }
                    );
                  }
                }

                // channel.ack(msg);
              }

              if (options?.delayBeforeAck > 0) {
                setTimeout(() => {
                  channel.ack(msg);
                }, options?.delayBeforeAck);
              } else {
                channel.ack(msg);
              }
            },
            { noAck: false, ...(queue?.consumeOptions?.others || {}) }
          );
        }
      }

      console.log(
        `RabbitMQConnection: Register exchange receiver "${options.id}" successfully`
      );
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
  }

  async publishMessage(
    exchangeId: string,
    msg: RabbitMQMessage,
    options?: RabbitMQPublishMessageOptions
  ) {
    console.log("RabbitMQConnection: Publish message", {
      exchangeId,
      msg,
      options,
    });

    if (this._checkExistedExchangeSender(exchangeId)) {
      const { channel, exchange } = this._exchangeSenders[exchangeId];

      const msgWrapper: RabbitMQMessageWrapper = {
        ...msg,
        currentScheduling: 1,
        publishOptions: pick(["persistent", "others"], options || {}),
      };

      return channel.publish(
        exchange,
        options?.routing || "",
        Buffer.from(this._encryptMessageForSender(msgWrapper)),
        {
          persistent: options?.persistent || false,
          ...(options?.others || {}),
          headers: {
            ...(options?.others?.headers || {}),
            "x-delay": options?.delay || 0,
          },
        }
      );
    }

    return false;
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
