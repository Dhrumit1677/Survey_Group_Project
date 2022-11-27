"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../Controllers/index");
const router = express_1.default.Router();
router.get('/', index_1.DisplayHomePage);
exports.default = router;
//# sourceMappingURL=index.js.map

router.get("/rateUS", (req, res) => {
    res.render('content/rateUS');
})