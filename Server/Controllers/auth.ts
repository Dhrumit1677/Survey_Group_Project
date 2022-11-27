import express from 'express';
import passport from 'passport';

import { AuthUser } from '../Util';

import User from '../Models/user';


const AFTER_AUTH_REDIRECT_PAGE = '/';

/* Display Functions */
export function DisplayLoginPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if (!req.user) {
        return res.render('index', {
            title: "Login",
            page: "login",
            messages: req.flash("loginMessage"),
            user: AuthUser(req),
        });
    }

    return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
}

export function DisplayRegisterPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
    if (!req.user) {
        return res.render('index', {
            title: "Register",
            page: "register",
            messages: req.flash("registerMessage"),
            user: AuthUser(req),
        });
    }

    return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
}

/* Processing Functions */
export function ProcessLoginPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            res.end(err);
        }

        if (!user) {
            req.flash('loginMessage', 'Authentication Error!');
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                res.end(err);
            }

            return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
        });
    })(req, res, next);
}

export function ProcessRegisterPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        nickname: `${req.body.firstName} ${req.body.lastName}`,
    });

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            if (err.name == "UserExistsError") {
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', 'Registration Error!');
            } else {
                console.error(err.name); // other error
                req.flash('registerMessage', 'Server Error');
            }

            return res.redirect('/register');
        }

        // automatically login the user
        return passport.authenticate('local')(req, res, () => {
            return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
        });
    });
}

export function ProcessLogoutPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
    req.logOut((err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }

        console.log('User Logged Out');
    });

    res.redirect('/login');
}