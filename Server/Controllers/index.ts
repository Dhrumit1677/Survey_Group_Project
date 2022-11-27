import express from 'express';

import { AuthUser } from '../Util';

export function DisplayHomePage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
  res.render('index', { title: 'Home', page: 'home', user: AuthUser(req) });
}
