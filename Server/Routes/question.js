"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_1 = require("../Controllers/question");
const Util_1 = require("../Util");
const router = express_1.default.Router({ mergeParams: true });
router.get('/create', Util_1.AuthGuard, question_1.DisplayQuestionCreatePage);
router.post('/create', Util_1.AuthGuard, question_1.ProcessQuestionCreatePage);
router.get('/:qid/edit', Util_1.AuthGuard, question_1.DisplayQuestionEditPage);
router.post('/:qid/edit', Util_1.AuthGuard, question_1.ProcessQuestionEditPage);
router.get('/:qid/delete', Util_1.AuthGuard, question_1.ProcessQuestionDeletePage);
exports.default = router;
//# sourceMappingURL=question.js.map