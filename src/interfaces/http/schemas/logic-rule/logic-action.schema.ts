import { z } from "zod";

export const LogicActionSchema = z.enum(["show", "hide", "jump_to"]);
