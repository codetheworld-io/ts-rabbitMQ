import { NextFunction, Response } from 'express';
import { RequestWithUserId } from '../ApiApp';
import SubscriptionModel from '../models/SubscriptionModel';

class SubscriptionController {
  async subscribeUser(req: RequestWithUserId, res: Response, next: NextFunction) {
    try {
      const { body, userId } = req;

      const subscription = await SubscriptionModel.findOne({
        userId: req.userId,
        endpoint: body.endpoint,
      });

      if (subscription) {
        return res.status(200).json({ message: 'User is subscribed.' });
      }

      await SubscriptionModel.create({
        userId,
        ...body,
      });

      res.status(201).json({ message: 'User is subscribed.' });
    } catch (error) {
      next(error);
    }
  }

  async unsubscribeUser(req: RequestWithUserId, res: Response, next: NextFunction) {
    try {
      await SubscriptionModel.deleteMany({ userId: req.userId });

      res.status(200).json({ message: 'User is unsubscribed.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new SubscriptionController();
