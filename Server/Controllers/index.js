"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayHomePage = void 0;
const Util_1 = require("../Util");
function DisplayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', user: (0, Util_1.AuthUser)(req) });
}
exports.DisplayHomePage = DisplayHomePage;
//# sourceMappingURL=index.js.map