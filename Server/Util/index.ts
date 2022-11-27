import express from 'express';

import { IUserDocument } from '../Models/user';

export function AuthUser(req: express.Request): IUserDocument | null
{
    if (!req.user) return null;

    const user = req.user as IUserDocument;

    return user;
}

export function AuthGuard(req: express.Request, res: express.Response, next: express.NextFunction): void
{
    if (!req.isAuthenticated()) return res.redirect('/login');
    next();
}
