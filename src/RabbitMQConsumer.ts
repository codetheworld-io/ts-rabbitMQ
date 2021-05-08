/* eslint-disable no-console */
import dotenv from 'dotenv';
import RabbitMQHelper, { IPushMessage } from './libs/RabbitMQHelper';
import WebPush from './libs/WebPush';

(async () => {
  dotenv.config();

  await RabbitMQHelper.consume(async (message) => {
    if (!message) {
      return;
    }

    console.log(" [x] Received %s", message.content.toString());

    try {
      const { subscriptions, body } = JSON.parse(message.content.toString()) as IPushMessage;

      if (!subscriptions) {
        return;
      }

      for (const subscription of subscriptions) {
        await WebPush.pushToSubscription(subscription, body).catch((error) => {
          console.log(" [x] WebPushError  %s", error.message);
        });
      }
    } catch (error) {
      console.log(" [x] Error %s", error.message);
    }
  });

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", RabbitMQHelper.queue);
})();
