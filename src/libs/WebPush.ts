import webpush, { RequestOptions } from 'web-push';
import { ISubscriptionDocument } from "../models/SubscriptionModel";

class WebPush {
  pushToSubscription(subscription: ISubscriptionDocument, data = '') {
    const options: RequestOptions = {
      vapidDetails: {
        subject: 'https://hoangdv.medium.com/',
        publicKey: process.env.VAPID_PUBLIC_KEY as string,
        privateKey: process.env.VAPID_PRIVATE_KEY as string,
      },
      // 1 hour in seconds.
      TTL: 60 * 60,
    };

    return webpush.sendNotification(
      subscription.toJSON(),
      data,
      options,
    );
  }
}

export default new WebPush();
