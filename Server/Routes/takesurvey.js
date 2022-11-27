"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const takesurvey_1 = require("../Controllers/takesurvey");
const Util_1 = require("../Util");
const router = express_1.default.Router();
router.get('/', Util_1.AuthGuard, takesurvey_1.DisplayTakeSurveysPage);
router.get('/:sid', Util_1.AuthGuard, takesurvey_1.ProcessTakeSurveyPage);
router.get('/:sid/question/:qid', Util_1.AuthGuard, takesurvey_1.DisplayTakeSurveyQuestionPage);
router.post('/:sid/question/:qid', Util_1.AuthGuard, takesurvey_1.ProcessTakeSurveyQuestionPage);
router.get('/:sid/thanks', Util_1.AuthGuard, takesurvey_1.DisplayTakeSurveyThanksPage);
exports.default = router;
//# sourceMappingURL=takesurvey.js.map