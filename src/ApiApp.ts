import express, { Application, Request } from 'express';
import path from 'path';
import CookieHelper from './libs/CookieHelper';
import { v4 as uuid } from 'uuid';

export type RequestWithUserId = Request & { userId?: string };

class ApiApp {
  private application: Application;

  constructor() {
    this.application = express();
    this.setupGlobalMiddleware();
    this.setupRouters();
  }

  start(port: string | number = 3000) {
    return this.application.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`listening on port ${port}`);
    });
  }

  getApplication() {
    return this.application;
  }

  private setupGlobalMiddleware() {
    this.application.use(express.json());
    this.handleUserSession();
    this.application.use(express.static(path.join(__dirname, 'public')));
  }

  private setupRouters() {
    this.application.get('/', (_, res) => {
      res.redirect('/index.html');
    });
  }

  private handleUserSession() {
    this.application.use((req: RequestWithUserId, res, next) => {
      const userId = CookieHelper.getUserId(req);

      if (userId) {
        req.userId = userId;
        return next();
      }

      const newUserId = uuid();

      if (!req.xhr) {
        CookieHelper.sendUserIdCookieToClient(newUserId, res);
      }

      req.userId = newUserId;
      next();
    });
  }
}

export default new ApiApp();
