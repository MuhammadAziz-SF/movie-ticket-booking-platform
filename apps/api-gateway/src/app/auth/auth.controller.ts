import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CreateAdminReq,
  CreateAdminRes,
  AdminLoginReq,
  AdminLoginRes,
  AdminConfirmLoginReq,
  AdminConfirmLoginRes,
  AdminLogoutRes,
  AdminFindAllReq,
  AdminFindAllRes,
  AdminFindOneReq,
  AdminFindOneRes,
  AdminUpdateReq,
  AdminUpdateRes,
  AdminDeleteReq,
  AdminDeleteRes,
  SignUpUserReq,
  SignUpUserRes,
  UserLoginReq,
  UserLoginRes,
  UserConfirmLoginReq,
  UserConfirmLoginRes,
  UserConfirmSignUpReq,
  UserConfirmSignUpRes,
  UserUpdateReq,
  UserUpdateRes,
  UserDeleteReq,
  UserDeleteRes,
  UserFindAllReq,
  UserFindAllRes,
  UserFindOneReq,
  UserFindOneRes,
} from 'types/proto/auth';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('create-admin')
  createAdmin(@Body() body: CreateAdminReq): Observable<CreateAdminRes> {
    return this.authService.createAdmin(body);
  }

  @Post('admin-login')
  adminLogin(@Body() body: AdminLoginReq): Observable<AdminLoginRes> {
    return this.authService.adminLogin(body);
  }

  @Post('admin-confirm-login')
  adminConfirmLogin(@Body() body: AdminConfirmLoginReq): Observable<AdminConfirmLoginRes> {
    return this.authService.adminConfirmLogin(body);
  }

  @Post('admin-logout')
  adminLogout(): Observable<AdminLogoutRes> {
    return this.authService.adminLogout({});
  }

  @Post('admin-find-all')
  adminFindAll(@Body() body: AdminFindAllReq): Observable<AdminFindAllRes> {
    return this.authService.adminFindAll(body);
  }

  @Post('admin-find-one')
  adminFindOne(@Body() body: AdminFindOneReq): Observable<AdminFindOneRes> {
    return this.authService.adminFindOne(body);
  }

  @Post('admin-update')
  adminUpdate(@Body() body: AdminUpdateReq): Observable<AdminUpdateRes> {
    return this.authService.adminUpdate(body);
  }

  @Post('admin-delete')
  adminDelete(@Body() body: AdminDeleteReq): Observable<AdminDeleteRes> {
    return this.authService.adminDelete(body);
  }

  @Post('user-signup')
  signUpUser(@Body() body: SignUpUserReq): Observable<SignUpUserRes> {
    return this.authService.signUpUser(body);
  }

  @Post('user-login')
  userLogin(@Body() body: UserLoginReq): Observable<UserLoginRes> {
    return this.authService.userLogin(body);
  }

  @Post('user-confirm-login')
  userConfirmLogin(@Body() body: UserConfirmLoginReq): Observable<UserConfirmLoginRes> {
    return this.authService.userConfirmLogin(body);
  }

  @Post('user-confirm-signup')
  userConfirmSignUp(@Body() body: UserConfirmSignUpReq): Observable<UserConfirmSignUpRes> {
    return this.authService.userConfirmSignUp(body);
  }

  @Post('user-update')
  userUpdate(@Body() body: UserUpdateReq): Observable<UserUpdateRes> {
    return this.authService.userUpdate(body);
  }

  @Post('user-delete')
  userDelete(@Body() body: UserDeleteReq): Observable<UserDeleteRes> {
    return this.authService.userDelete(body);
  }

  @Post('user-find-all')
  userFindAll(@Body() body: UserFindAllReq): Observable<UserFindAllRes> {
    return this.authService.userFindAll(body);
  }

  @Post('user-find-one')
  userFindOne(@Body() body: UserFindOneReq): Observable<UserFindOneRes> {
    return this.authService.userFindOne(body);
  }
}
