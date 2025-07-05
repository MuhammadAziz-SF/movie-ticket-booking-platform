import { Controller } from '@nestjs/common';
import { AuthService } from './app.service';
import {
  AdminConfirmLoginReq,
  AdminConfirmLoginRes,
  AdminDeleteReq,
  AdminDeleteRes,
  AdminFindAllReq,
  AdminFindAllRes,
  AdminFindOneReq,
  AdminFindOneRes,
  AdminLoginReq,
  AdminLoginRes,
  AdminLogoutRes,
  AdminUpdateReq,
  AdminUpdateRes,
  AuthServiceController,
  AuthServiceControllerMethods,
  CreateAdminReq, 
  CreateAdminRes,
  SignUpUserReq,
  SignUpUserRes,
  UserConfirmLoginReq,
  UserConfirmLoginRes,
  UserConfirmSignUpReq,
  UserConfirmSignUpRes,
  UserDeleteReq,
  UserDeleteRes,
  UserFindAllReq,
  UserFindAllRes,
  UserFindOneReq,
  UserFindOneRes,
  UserLoginReq,
  UserLoginRes,
  UserUpdateReq,
  UserUpdateRes
  } from '@app/types/proto/auth';
import { Observable } from 'rxjs';


@Controller()
@AuthServiceControllerMethods()
export class AuthController  implements AuthServiceController{
  constructor(private readonly authService: AuthService) {}

  createAdmin(request: CreateAdminReq): Promise<CreateAdminRes> | Observable<CreateAdminRes> | CreateAdminRes {
    return this.authService.createAdmin(request)
  }

  adminLogin(request: AdminLoginReq): Promise<AdminLoginRes> | Observable<AdminLoginRes> | AdminLoginRes {
    return this.authService.adminLogin(request)
  }

  adminConfirmLogin(request: AdminConfirmLoginReq): Promise<AdminConfirmLoginRes> | Observable<AdminConfirmLoginRes> | AdminConfirmLoginRes {
    return this.authService.adminConfirmLogin(request)
  }

  adminLogout(): Promise<AdminLogoutRes> | Observable<AdminLogoutRes> | AdminLogoutRes {
    return this.authService.adminLogout()
  }

  adminFindAll(request: AdminFindAllReq): Promise<AdminFindAllRes> | Observable<AdminFindAllRes> | AdminFindAllRes {
    return this.authService.adminFindAll(request)
  }

  adminFindOne(request: AdminFindOneReq): Promise<AdminFindOneRes> | Observable<AdminFindOneRes> | AdminFindOneRes {
    return this.authService.adminFindOne(request)
  }

  adminUpdate(request: AdminUpdateReq): Promise<AdminUpdateRes> | Observable<AdminUpdateRes> | AdminUpdateRes {
    return this.authService.adminUpdate(request)
  }

  adminDelete(request: AdminDeleteReq): Promise<AdminDeleteRes> | Observable<AdminDeleteRes> | AdminDeleteRes {
    return this.authService.adminDelete(request)
  }

  signUpUser(request: SignUpUserReq): Promise<SignUpUserRes> | Observable<SignUpUserRes> | SignUpUserRes {
    return this.authService.userSignUp(request)
  }

  userLogin(request: UserLoginReq): Promise<UserLoginRes> | Observable<UserLoginRes> | UserLoginRes {
    return this.authService.userLogin(request)
  }


  userConfirmLogin(request: UserConfirmLoginReq): Promise<UserConfirmLoginRes> | Observable<UserConfirmLoginRes> | UserConfirmLoginRes {
    return this.authService.userConfirmLogin(request)
  }

  userConfirmSignUp(request: UserConfirmSignUpReq): Promise<UserConfirmSignUpRes> | Observable<UserConfirmSignUpRes> | UserConfirmSignUpRes {
    return this.authService.userConfirmSignUp(request)
  }

  userUpdate(request: UserUpdateReq): Promise<UserUpdateRes> | Observable<UserUpdateRes> | UserUpdateRes {
    return this.authService.userUpdate(request)
  }

  userDelete(request: UserDeleteReq): Promise<UserDeleteRes> | Observable<UserDeleteRes> | UserDeleteRes {
    return this.authService.userDelete(request)
  }

  userFindAll(request: UserFindAllReq): Promise<UserFindAllRes> | Observable<UserFindAllRes> | UserFindAllRes {
    return this.authService.userFindAll(request)
  }

  userFindOne(request: UserFindOneReq): Promise<UserFindOneRes> | Observable<UserFindOneRes> | UserFindOneRes {
    return this.authService.userFindOne(request)
  }

}
