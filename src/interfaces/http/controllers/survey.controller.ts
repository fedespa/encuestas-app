import type { Request, Response } from "express";

export class SurveyController {
    constructor (
        private readonly deps: {}
    ){}

    public async create(req: Request, res: Response){
        return res.status(200)
    }

}