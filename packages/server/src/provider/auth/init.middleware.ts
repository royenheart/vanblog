import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InitProvider } from '../init/init.provider';
import { BASE_PREFIX } from 'src/utils/loadBasePath';

@Injectable()
export class InitMiddleware implements NestMiddleware {
  constructor(private readonly initProvider: InitProvider) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const requestMethod = req.method;
    if (
      req.path == `${BASE_PREFIX}/api/admin/init` ||
      (requestMethod === 'POST' &&
        req.path == `${BASE_PREFIX}/api/admin/img/upload`) ||
      (requestMethod === 'POST' &&
        req.path == `${BASE_PREFIX}/api/admin/init/upload`) ||
      (requestMethod === 'GET' &&
        req.path == `${BASE_PREFIX}/api/admin/caddy/ask`)
    ) {
      req.url = req.url.replace(`${BASE_PREFIX}`, '');
      next();
    } else {
      const hasInit = await this.initProvider.checkHasInited();
      if (hasInit) {
        req.url = req.url.replace(`${BASE_PREFIX}`, '');
        next();
      } else {
        res.json({
          statusCode: 233,
          message: '未初始化!',
          data: {
            allowDomains: process.env.VAN_BLOG_ALLOW_DOMAINS || '',
          },
        });
      }
    }
  }
}
