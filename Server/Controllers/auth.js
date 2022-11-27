"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessLogoutPage = exports.ProcessRegisterPage = exports.ProcessLoginPage = exports.DisplayRegisterPage = exports.DisplayLoginPage = void 0;
const passport_1 = __importDefault(require("passport"));
const Util_1 = require("../Util");
const user_1 = __importDefault(require("../Models/user"));
const AFTER_AUTH_REDIRECT_PAGE = '/';
function DisplayLoginPage(req, res, next) {
    if (!req.user) {
        return res.render('index', {
            title: "Login",
            page: "login",
            messages: req.flash("loginMessage"),
            user: (0, Util_1.AuthUser)(req),
        });
    }
    return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
}
exports.DisplayLoginPage = DisplayLoginPage;
function DisplayRegisterPage(req, res, next) {
    if (!req.user) {
        return res.render('index', {
            title: "Register",
            page: "register",
            messages: req.flash("registerMessage"),
            user: (0, Util_1.AuthUser)(req),
        });
    }
    return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
}
exports.DisplayRegisterPage = DisplayRegisterPage;
function ProcessLoginPage(req, res, next) {
    passport_1.default.authenticate('local', (err, user, info) => {
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
exports.ProcessLoginPage = ProcessLoginPage;
function ProcessRegisterPage(req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        email: req.body.email,
        nickname: `${req.body.firstName} ${req.body.lastName}`,
    });
    user_1.default.register(newUser, req.body.password, (err) => {
        if (err) {
            if (err.name == "UserExistsError") {
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', 'Registration Error!');
            }
            else {
                console.error(err.name);
                req.flash('registerMessage', 'Server Error');
            }
            return res.redirect('/register');
        }
        return passport_1.default.authenticate('local')(req, res, () => {
            return res.redirect(AFTER_AUTH_REDIRECT_PAGE);
        });
    });
}
exports.ProcessRegisterPage = ProcessRegisterPage;
function ProcessLogoutPage(req, res, next) {
    req.logOut((err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log('User Logged Out');
    });
    res.redirect('/login');
}
exports.ProcessLogoutPage = ProcessLogoutPage;
//# sourceMappingURL=auth.js.map