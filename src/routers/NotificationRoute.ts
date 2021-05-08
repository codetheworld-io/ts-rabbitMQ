import { Router } from 'express';
import PushController from '../controllers/NotificationController';

class NotificationRoute {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRouter();
  }

  private setupRouter() {
    this.router.post('/:userId', async (req, res, next) => {
      await PushController.pushNotificationToUser(req, res, next);
    });

    this.router.post('/', async (req, res, next) => {
      await PushController.pushAll(req, res, next);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new NotificationRoute();
