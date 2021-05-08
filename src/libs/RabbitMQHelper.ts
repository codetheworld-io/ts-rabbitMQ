import amqp, { Channel, Connection, ConsumeMessage, Replies } from 'amqplib';
import { ISubscription } from '../models/SubscriptionModel';

export interface IPushMessage {
  subscriptions: ISubscription[];
  body: unknown;
}

class RabbitMQHelper {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  
  get queue () {
    return process.env.RABBITMQ_PUSH_QUEUE || 'push_task'
  }

  async getConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await amqp.connect(
      {
        hostname: process.env.RABBITMQ_HOST,
        port: parseInt(process.env.RABBITMQ_PORT || '5672'),
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
      }
    );
    return this.connection;
  }

  async getChannel(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }

    this.channel = await (await this.getConnection()).createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });

    return this.channel;
  }

  async sendPushMessage(message: IPushMessage): Promise<boolean> {
    const stringMessage = JSON.stringify(message);
    return (await this.getChannel()).sendToQueue(this.queue, Buffer.from(stringMessage));
  }

  async consume(onMessage: (msg: ConsumeMessage | null) => void): Promise<Replies.Consume> {
    return (await this.getChannel()).consume(this.queue, onMessage, { noAck: true });
  }
}

export default new RabbitMQHelper();
