import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { VerifiedUserInterface } from './auth/verified-user.interface';

@Controller('/')
export class AppController {  
 
  @Get()
  getHello(@Req() req: VerifiedUserInterface): string {
    const username = req.user?.fullName;

    if(username) {
      return `Hello, ${username}`;
    }
    return 'Hello World';

  }
}
