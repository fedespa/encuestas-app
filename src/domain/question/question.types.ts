export type QuestionType =
  | "text"
  | "number"
  | "date"
  | "rating"
  | "single_choice"
  | "multiple_choice";

export type QuestionOptions =
  | { type: "text" }
  | { type: "number" }
  | { type: "date" }
  | { type: "rating"; scale: number }
  | { type: "single_choice"; options: string[] }
  | { type: "multiple_choice"; options: string[] };
