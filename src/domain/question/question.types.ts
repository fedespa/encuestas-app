export type QuestionType =
  | "text"
  | "number"
  | "date"
  | "single_choice"
  | "multiple_choice"
  | "rating"
;

export type QuestionOptions =
  | { type: "text" }
  | { type: "number" }
  | { type: "date" }
  | { type: "rating"; scale: number }     
  | { type: "single_choice"; options: string[] }
  | { type: "multiple_choice"; options: string[] };
