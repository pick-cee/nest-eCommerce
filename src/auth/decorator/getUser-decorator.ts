import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import * as express from 'express';

interface IUserRequest extends express.Request {
    user: any
}

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: IUserRequest = ctx.switchToHttp().getRequest()
        if(data){
            return request.user[data]
        }
        return request.user
    }
)