import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Observable } from "rxjs";
import { VerifiedUserInterface } from "./verified-user.interface";

@Injectable()
export class AuthGuard implements CanActivate {

  // constructor(
  //  // private reflector: Reflector,

  //  // @Inject(forwardRef(() => UserService))
  //   //private userService: UserService
  // ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      //  const test = request;
       const request2 = context.switchToHttp().getRequest<VerifiedUserInterface>();
       return !!request2.user;
        //const { user } = request;
      // return !!user;
    }
}