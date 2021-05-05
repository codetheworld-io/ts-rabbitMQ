import { Request, Response } from "express";

class CookieHelper {
  sendUserIdCookieToClient(userId: string, res: Response) {
    const oneMonthToSeconds = 30 * 24 * 60 * 60;
    res.cookie('userId', userId, {
      maxAge: oneMonthToSeconds,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
  }

  getRequestCookies(req: Request): { [key: string]: string } {
    const parsedCookies: { [key: string]: string } = {};
    const rawCookies = req.headers.cookie?.split('; ');

    if (!rawCookies) {
      return parsedCookies;
    }

    rawCookies.forEach(rawCookie => {
      const [key, value] = rawCookie.split('=');
      parsedCookies[key] = value;
    });
    return parsedCookies;
  }

  getUserId(req: Request): string {
    return this.getRequestCookies(req)['userId'];
  }
}

export default new CookieHelper();
