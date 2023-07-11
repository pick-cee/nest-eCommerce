import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import * as express from 'express';

interface IUserRequest extends express.Request {
    user: any
}

export const GetUser = createParamDecorator(
    (data: any | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest()
        if(data){
            return request.user[data]
        }
        return request.user
    }
)