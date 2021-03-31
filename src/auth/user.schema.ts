import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop()
    passwordHash: string;

    @Prop()
    fullName: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

export class UserWithoutPassword extends User{
    @Exclude()
    passwordHash: string;
}
