import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { Exclude, Expose } from 'class-transformer';
import { Item } from "../items/schemas/item.schema";
import { Role } from "./role.enum";


export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;

    @Prop({required: true})
    fullName: string;

    @Prop({required: true})
    role: Role;

    @Prop({required: true, type: [{ type: SchemaTypes.ObjectId, ref: Item.name }]})
    items: Item[];

    @Prop({required: false})
    refreshToken: String;
}
export const UserSchema = SchemaFactory.createForClass(User);

export class UserWithoutPassword extends User{
    @Exclude()
    _id: object;
    
    @Expose()
    get id(): string { return this._id.toString(); };

    @Exclude()
    passwordHash: string;

    @Exclude()
    items: Item[];

    @Exclude()
    refreshToken: String;

    constructor(obj : Partial<UserWithoutPassword>){
        super();
        Object.assign(this, obj);
    }

}
