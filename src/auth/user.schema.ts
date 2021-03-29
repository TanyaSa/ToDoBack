//import { Contains, MinLength } from "class-validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    // @Contains('@', {
    //     message: 'Email should contain @ sign.',
    // })
    email: string;

    @Prop()
    // @MinLength(8, {
    //     message: 'Password should contain more than 8 symbols.',
    // })
    password: string;

    @Prop()
    // @MinLength(3, {
    //     message: 'Full name should contain more than 3 symbols.',
    // })
    fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
