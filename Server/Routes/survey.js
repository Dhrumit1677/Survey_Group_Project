"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const survey_1 = require("../Controllers/survey");
const Util_1 = require("../Util");
const router = express_1.default.Router();
router.get('/', Util_1.AuthGuard, survey_1.DisplaySurveysPage);
router.get('/create', Util_1.AuthGuard, survey_1.DisplaySurveyCreatePage);
router.post('/create', Util_1.AuthGuard, survey_1.ProcessSurveyCreatePage);
router.get('/:id', Util_1.AuthGuard, survey_1.DisplaySurveyDetailsPage);
router.get('/:id/edit', Util_1.AuthGuard, survey_1.DisplaySurveyEditPage);
router.post('/:id/edit', Util_1.AuthGuard, survey_1.ProcessSurveyEditPage);
router.get('/:id/delete', Util_1.AuthGuard, survey_1.ProcessSurveyDeletePage);
exports.default = router;
//# sourceMappingURL=survey.js.map