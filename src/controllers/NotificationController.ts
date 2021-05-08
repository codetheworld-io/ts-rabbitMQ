import { NextFunction, Request, Response } from 'express';
import RabbitMQHelper from '../libs/RabbitMQHelper';
import SubscriptionModel from '../models/SubscriptionModel';

class NotificationController {
  async pushNotificationToUser(req: Request & { params: { userId?: string } }, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const subscriptions = await SubscriptionModel.find({
        userId: userId,
      });

      await RabbitMQHelper.sendPushMessage({
        subscriptions: subscriptions.map((s) => s.toJSON()),
        body: req.body,
      });

      res.status(200).json({ message: 'Done.', notifications: subscriptions.length });
    } catch (error) {
      next(error);
    }
  }

  async pushAll(req: Request, res: Response, next: NextFunction) {
    try {
      const subscriptions = await SubscriptionModel.find({});

      const chunkSize = 100;
      for (let i = 0, j = subscriptions.length; i < j; i += chunkSize) {
        const chunked = subscriptions.slice(i, i + chunkSize);
        await RabbitMQHelper.sendPushMessage({
          subscriptions: chunked.map((s) => s.toJSON()),
          body: req.body,
        });
      }

      res.status(200).json({ message: 'Done.', subscriptions: subscriptions.length });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
