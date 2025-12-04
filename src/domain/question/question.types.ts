export type QuestionType =
  | "text"
  | "number"
  | "date"
  | "single-choice"
  | "multiple-choice"
  | "rating"
  | "file";

export type QuestionOptions =
  | { type: "text" }
  | { type: "number" }
  | { type: "date" }
  | { type: "file" }
  | { type: "rating"; scale: number }     
  | { type: "single-choice"; options: string[] }
  | { type: "multiple-choice"; options: string[] };
