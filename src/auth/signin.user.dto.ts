import { IsNotEmpty } from "class-validator";

export class SigninUserDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    // @IsNotEmpty()
    // role: string;
}