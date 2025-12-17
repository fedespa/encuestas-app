import type { QuestionStatsVm } from "../question-stats/questions-stats.vm.js";
import type { SurveyStatsVm } from "../survey-stats/survey-stats.vm.js";
import type { SurveyVm } from "./survey.vm.js";

export interface SurveyWithStatsVm {
  survey: SurveyVm;
  stats: SurveyStatsVm;
  questions: QuestionStatsVm[];
}
