// export class CreateUserDto {
//     email: string;
//     password: string;
//     fullName: string;
// }
import { Contains, MinLength } from "class-validator";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class CreateUserDto {
    @Prop()
    @MinLength(5, {
        message: 'Email should contain more than 5 symbols.',
    })
    @Contains('@', {
        message: 'Email should contain @ sign.',
    })
    email: string;

    @Prop()
    @MinLength(8, {
        message: 'Password should contain more than 8 symbols.',
    })
    password: string;

    @Prop()
    @MinLength(3, {
        message: 'Full name should contain more than 3 symbols.',
    })
    fullName: string;
}