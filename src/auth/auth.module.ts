import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import { User, UserSchema } from './user.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: 'hard!to-guess_secret' }) ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}