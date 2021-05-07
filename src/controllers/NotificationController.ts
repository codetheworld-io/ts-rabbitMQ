import { NextFunction, Request, Response } from 'express';
import WebPush from '../libs/WebPush';
import SubscriptionModel from '../models/SubscriptionModel';

class NotificationController {
  async pushNotificationToUser(req: Request & { params: { userId?: string } }, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const subscriptions = await SubscriptionModel.find({
        userId: userId,
      });

      for (const sub of subscriptions) {
        await WebPush.pushToSubscription(sub, JSON.stringify(req.body));
      }

      res.status(200).json({ message: 'Done.', notifications: subscriptions.length });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
