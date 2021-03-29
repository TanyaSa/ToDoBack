import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { UserDTO } from "./user.interface";
import { User, UserDocument } from './user.schema';
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    
    async sighUp(userDTO: UserDTO): Promise<User> { 
        
       
        const saltOrRounds = 10;
        const password = userDTO.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        userDTO.password = hash;
        // }

        // else {
        //     const userPassword = userDTO.password;
        
        //     async function getHashedPassword(password) {
        //         const saltOrRounds = 10;
        //         const hash = await bcrypt.hash(password, saltOrRounds);
        //         return hash;
        //     }
        
        //     let hashPassword = getHashedPassword(userPassword);
        //     userDTO.password = hashPassword;
        // }

        // if (!(userDTO.email.includes('@')))
        // {
        //     throw new NotFoundException('Email should contain \'@\' sign.'); /////////????????????
        // }

        const createdUser = new this.userModel(userDTO);
        return createdUser.save(); 
    }
}
