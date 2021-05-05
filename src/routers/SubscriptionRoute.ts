import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController';

class SubscriptionRoute {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRouter();
  }

  private setupRouter() {
    this.router.post('/', async (req, res, next) => {
      await SubscriptionController.subscribeUser(req, res, next);
    });

    this.router.delete('/', async (req, res, next) => {
      await SubscriptionController.unsubscribeUser(req, res, next);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new SubscriptionRoute();
