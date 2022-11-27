"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.AuthUser = void 0;
function AuthUser(req) {
    if (!req.user)
        return null;
    const user = req.user;
    return user;
}
exports.AuthUser = AuthUser;
function AuthGuard(req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/login');
    next();
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=index.js.map