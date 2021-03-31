import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from "mongoose";
import { UserInterface } from "./user.interface";
import { User, UserDocument, UserWithoutPassword } from './user.schema';
import * as bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
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
            throw new HttpException ({
                status: HttpStatus.BAD_REQUEST,
                error: 'User alreasdy registered.',
            }, 
            HttpStatus.CONFLICT); 
        } 

        const createdUser = new this.userModel(userInterface);
        createdUser.save();

        return plainToClass(UserWithoutPassword, createdUser.toObject());
    }

    getHashedPassword(password) {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }

    getByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }

    async signIn(signinUserDto: SigninUserDto): Promise<string> {

        const email = signinUserDto.email;
        const userFound = await this.getByEmail(email);

        if (!userFound) {
            return 'Invalid username or password.';
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(signinUserDto.password, userFound.passwordHash, (err, res) => {
                if (err) {
                    reject(err)
                } if (res) {
                    const token = this.jwtService.sign(userFound.toObject());
                    resolve(token);
                } else {
                    reject('Invalid username or password.');
                }
            });
        });

    }
}
