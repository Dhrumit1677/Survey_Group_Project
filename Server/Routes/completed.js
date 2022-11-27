"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const completed_1 = require("../Controllers/completed");
const Util_1 = require("../Util");
const router = express_1.default.Router({ mergeParams: true });
router.get('/', Util_1.AuthGuard, completed_1.DisplayCompletedSurveysPage);
router.get('/:sid', Util_1.AuthGuard, completed_1.DisplayCompletedSurveyDetailsPage);
exports.default = router;
//# sourceMappingURL=completed.js.map