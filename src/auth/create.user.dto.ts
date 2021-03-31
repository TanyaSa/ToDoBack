import { Contains, MinLength } from "class-validator";

export class CreateUserDto {
    @MinLength(5, {
        message: 'Email should contain more than 5 symbols.',
    })
    @Contains('@', {
        message: 'Email should contain @ sign.',
    })
    email: string;

    @MinLength(8, {
        message: 'Password should contain more than 8 symbols.',
    })
    password: string;

    @MinLength(3, {
        message: 'Full name should contain more than 3 symbols.',
    })
    fullName: string;

    // @BeforeInsert()
    // emailToLowerCase() {
    //     this.email = this.email.toLowerCase();
    // }
}