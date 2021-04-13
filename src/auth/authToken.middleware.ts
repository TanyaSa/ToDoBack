import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { UserWithoutPassword } from './user.schema';
import { VerifiedUserInterface } from './verified-user.interface';


@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    async use(req: VerifiedUserInterface, res: Response, next: NextFunction) {
        const authToken = req.headers['x-auth-token'];
        try {
            if (authToken) {
                req.user = await this.jwtService.verifyAsync<UserWithoutPassword>(authToken);
            }
        } 
        catch(err){
            console.log ('Error!', err);
        };

        next();
    }

}