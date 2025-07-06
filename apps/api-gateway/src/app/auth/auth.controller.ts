import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceController,
  CreateAdminReq,
  AdminLoginReq,
  AdminConfirmLoginReq,
  AdminFindAllReq,
  AdminUpdateReq,
  AdminDeleteReq,
  SignUpUserReq,
  UserLoginReq,
  UserConfirmLoginReq,
  UserConfirmSignUpReq,
  UserUpdateReq,
  UserDeleteReq,
  UserFindAllReq,
  AdminFindOneReq,
  UserFindOneReq,
} from 'types/proto/auth';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceController;

  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceController>(AUTH_SERVICE_NAME);
  }

  @Post('admin/create')
  createAdmin(@Body() body: CreateAdminReq) {
    return this.authService.createAdmin(body);
  }

  @Post('admin/login')
  adminLogin(@Body() body: AdminLoginReq) {
    return this.authService.adminLogin(body);
  }

  @Post('admin/login/confirm')
  adminConfirmLogin(@Body() body: AdminConfirmLoginReq) {
    return this.authService.adminConfirmLogin(body);
  }

  @Post('admin/logout')
  adminLogout() {
    return this.authService.adminLogout({});
  }

  @Post('admin/find-all')
  adminFindAll(@Body() body: AdminFindAllReq) {
    return this.authService.adminFindAll(body);
  }

  @Post('admin/find-one')
  adminFindOne(@Body() body: AdminFindOneReq) {
    return this.authService.adminFindOne(body);
  }

  @Post('admin/update')
  adminUpdate(@Body() body: AdminUpdateReq) {
    return this.authService.adminUpdate(body);
  }

  @Post('admin/delete')
  adminDelete(@Body() body: AdminDeleteReq) {
    return this.authService.adminDelete(body);
  }

  @Post('user/signup')
  signUpUser(@Body() body: SignUpUserReq) {
    return this.authService.signUpUser(body);
  }

  @Post('user/signup/confirm')
  userConfirmSignUp(@Body() body: UserConfirmSignUpReq) {
    return this.authService.userConfirmSignUp(body);
  }

  @Post('user/login')
  userLogin(@Body() body: UserLoginReq) {
    return this.authService.userLogin(body);
  }

  @Post('user/login/confirm')
  userConfirmLogin(@Body() body: UserConfirmLoginReq) {
    return this.authService.userConfirmLogin(body);
  }

  @Post('user/update')
  userUpdate(@Body() body: UserUpdateReq) {
    return this.authService.userUpdate(body);
  }

  @Post('user/delete')
  userDelete(@Body() body: UserDeleteReq) {
    return this.authService.userDelete(body);
  }

  @Post('user/find-all')
  userFindAll(@Body() body: UserFindAllReq) {
    return this.authService.userFindAll(body);
  }

  @Post('user/find-one')
  userFindOne(@Body() body: UserFindOneReq) {
    return this.authService.userFindOne(body);
  }
}
