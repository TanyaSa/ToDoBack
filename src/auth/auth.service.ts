import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from "mongoose";
import { UserInterface } from "./user.interface";
import { User, UserDocument, UserWithoutPassword } from './user.schema';
import * as bcrypt from "bcrypt";
import { classToPlain, plainToClass } from "class-transformer";
import { SigninUserDto } from './signin.user.dto';
const refreshSecret = 'JWT_REFRESH_TOKEN_SECRET';

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

    getById(id) {
        return this.userModel.findById(id).exec();
    }


    generateTokenPair(payload) {
        const accessToken = this.jwtService.sign(payload, { expiresIn: '60s' });
        const refreshToken = this.jwtService.sign(payload, {
            secret: refreshSecret,
            expiresIn: '10000s'
        })
        this.userModel.findByIdAndUpdate(payload.id, { refreshToken }).exec();
        return { refreshToken, accessToken };
    }

    async refreshToken(refreshToken: string): Promise<{ refreshToken: string, accessToken: string }> {

        const user = this.jwtService.verify(refreshToken, { secret: refreshSecret });      //verify RefreshToken
        const userDb = await this.getById(user.id);                                       //get user by id
        if (userDb.refreshToken == refreshToken) {  
            const userWithoutPassword = new UserWithoutPassword(userDb.toObject());
            const plain = classToPlain(userWithoutPassword);
            return this.generateTokenPair(plain);                                    //generateTokenPair
        }
        throw new HttpException('Invalid refreshToken.', 400);


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
            return tokenPair;
        } else {
            throw new HttpException('Invalid username or password.', 400);
        }
    }
}
