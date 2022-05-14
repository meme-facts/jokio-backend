import { NextFunction, Request, Response } from "express";


export function ensureAuthenticated(request:Request, response:Response, next: NextFunction) {

    const authHeaders = request.headers.authorization;

    const [,token] = authHeaders.split('.');


}