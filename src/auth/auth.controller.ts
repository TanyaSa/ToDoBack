import { Body, Controller, Post, HttpCode, Req } from "@nestjs/common";
import { CreateUserDto } from './create.user.dto';
import { User } from './user.schema';
import { UserInterface } from './user.interface';
import { AuthService } from './auth.service';
import { SigninUserDto } from './signin.user.dto';
import { RefreshDto } from "./refreshToken.dto";
import { VerifiedUserInterface } from "./verified-user.interface";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('sign-up')
    sighUp(@Body() createUserDto: CreateUserDto): Promise<User> {
        const user = {
            email: createUserDto.email,
            passwordHash: createUserDto.password,
            fullName: createUserDto.fullName,
            role: createUserDto.role,
        } as UserInterface;

        return this.authService.sighUp(user);
    }

    @Post('sign-in')
    @HttpCode(200)
    sighIn(@Body() signinUserDto: SigninUserDto): Promise<{ refreshToken: string, accessToken: string }> {
        
        const userLogin = {
            email: signinUserDto.email,
            password: signinUserDto.password
            // role: signinUserDto.role
           };
        return this.authService.signIn(userLogin);
    }

    @Post('refresh')
    @HttpCode(200)
    refresh(@Body() refreshDto: RefreshDto): Promise<{ refreshToken: string, accessToken: string }> {
        return this.authService.refreshToken(refreshDto.refreshToken);
    }

    @Post('sign-out')
    @HttpCode(200)
    signOut(@Req() request: VerifiedUserInterface): Promise<void> {
        const token = request.headers['x-auth-token'];
        const userDb = request.user;
        return this.authService.signOut(userDb);
    }


}