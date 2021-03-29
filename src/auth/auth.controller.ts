import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from './user.dto';
import { User } from './user.schema';
import { UserDTO } from './user.interface';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/auth/sign-up')
    sighUp(@Body() createUserDto: CreateUserDto): Promise<User> {
        const user = {
            email: createUserDto.email,
            password: createUserDto.password,
            fullName: createUserDto.fullName
        } as UserDTO;
        return this.authService.sighUp(user);
    }

    @Post('/auth/sign-in')
    sighIn(@Body() createUserDto: CreateUserDto): Promise<User> {
        const user = {
            email: createUserDto.email,
            password: createUserDto.password,
            fullName: createUserDto.fullName
        } as UserDTO;
        return this.authService.sighUp(user);
    }

}