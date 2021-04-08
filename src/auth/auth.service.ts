import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from "mongoose";
import { UserInterface } from "./user.interface";
import { User, UserDocument, UserWithoutPassword } from './user.schema';
import * as bcrypt from "bcrypt";
import { classToPlain, plainToClass } from "class-transformer";
import { SigninUserDto } from './signin.user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    async sighUp(userInterface: UserInterface): Promise<User> {
        const userPassword = userInterface.passwordHash;
        let hashPassword = await this.getHashedPassword(userPassword);
        userInterface.passwordHash = hashPassword;

        const existedUser = await this.getByEmail(userInterface.email);

        if (existedUser) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'User alreasdy registered.',
            },
                HttpStatus.CONFLICT);
        }
        const createdUser = new this.userModel(userInterface);
        createdUser.save();
        return plainToClass(UserWithoutPassword, createdUser.toObject());
    }

    addItemToUser(userId: string, itemId: any) {
        return this.userModel.findByIdAndUpdate(userId, {
            $push: { items: itemId }
        }).exec();
    }

    getHashedPassword(password) {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }

    getByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }

    generateTokenPair(payload) { 
        const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
        const refreshToken = this.jwtService.sign(payload, {
            secret: ('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '10000s'
        })
        return { refreshToken, accessToken };
    }

    async signIn(signinUserDto: SigninUserDto): Promise<{ refreshToken: string, accessToken: string }> {

        const email = signinUserDto.email;
        const userFound = await this.getByEmail(email);

        if (!userFound) {
            throw new HttpException('Invalid username or password.', 400);
        }

        const res = await bcrypt.compare(signinUserDto.password, userFound.passwordHash);
        if (res) {
            const userWithoutPassword = new UserWithoutPassword(userFound.toObject());
            const plain = classToPlain(userWithoutPassword);
            const tokenPair = this.generateTokenPair(plain);

            this.userModel.findByIdAndUpdate(userFound.id, { refreshToken: tokenPair.refreshToken }).exec();

            return tokenPair;
        } else {
            throw new HttpException('Invalid username or password.', 400);
        }
    }
}
