/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service'; 
import {  AdminConfirmLoginReq, AdminConfirmLoginRes, AdminDeleteReq, AdminDeleteRes, AdminFindAllReq, AdminFindAllRes, AdminFindOneReq, AdminFindOneRes, AdminLoginReq, AdminLoginRes, AdminLogoutRes, AdminUpdateReq, AdminUpdateRes, CreateAdminReq, CreateAdminRes, SignUpUserReq, SignUpUserRes, UserConfirmLoginReq, UserConfirmLoginRes, UserConfirmSignUpReq, UserConfirmSignUpRes, UserDeleteReq, UserDeleteRes, UserFindAllReq, UserFindAllRes, UserFindOneReq, UserFindOneRes, UserLoginReq, UserLoginRes, UserUpdateReq, UserUpdateRes } from '@app/types/proto/auth'
import { catchError } from '@app/common/helper/catch.error';
import { config } from "@app/common/config"
import { MailService } from '@app/common/mail/mail.service'
import { UserRoles } from '@app/common/enum'
import { encrypt , decrypt} from '@app/common/helper/bcrypt'
import { generateOTP } from '@app/common/helper/otp'
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TokenService} from '@app/common/jwt/index'
import { clearCookie, writeToCookie } from '@app/common/helper/cookie'
import * as grpc from '@grpc/grpc-js'

const metadata = new grpc.Metadata();



@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly prisma: PrismaService,
    private readonly jwtService: TokenService,
    private readonly mailService: MailService,
    private readonly cacheManager: Cache
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const isSuperAdmin = await this.prisma.admin.findFirst({
        where: {role: UserRoles.SUPER_ADMIN}
      });

      if(!isSuperAdmin) {
        const hashedPassword = await encrypt(config.ADMIN_PASSWORD)
        await this.prisma.admin.create({data: {
          fullName: config.ADMIN_NAME,
          email: config.ADMIN_EMAIL,
          password: hashedPassword,
          phone: '9988899889',
          role: UserRoles.SUPER_ADMIN
        }});
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async createAdmin(req: CreateAdminReq): Promise<CreateAdminRes> {
    try {
      const {fullName, email, password} = req;

      const existingAdmin = await this.prisma.admin.findUnique({where: {email}});
      if(existingAdmin) {
        throw new ConflictException('Email already exists')
      }

      const hashedPassword = await encrypt(password);
      await this.prisma.admin.create({data: {
        fullName,
        email,
        phone: '99899989988',
        password: hashedPassword,
        role: UserRoles.ADMIN
      }})
    } catch (error) {
      return catchError(error)
    }
  }

  async adminLogin(req: AdminLoginReq): Promise<AdminLoginRes> {
    try {
      const { email, password } = req;

      const admin = await this.prisma.admin.findUnique({where: {email}});

      if(!admin) {
        throw new BadRequestException('Invalid credentials!');
      }

      const isPasswordValid = await decrypt(password, admin.password)
      if(!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials!')
      }

      const otp = generateOTP();
      await this.mailService.sendOtp(email, otp)
      await this.cacheManager.set(email, otp, 300000)
      return {otp: otp, message: `OTP send to email ${email}`}
    } catch (error) {
      return catchError(error)
    }
  }

  async adminConfirmLogin(req: AdminConfirmLoginReq): Promise<AdminConfirmLoginRes> {
    try {
      const { email, otp }  = req;
      const hasAdmin = await this.cacheManager.get(email);
      if(!hasAdmin || hasAdmin != otp) {
        throw new BadRequestException('OTP expired!')
      }

      await this.cacheManager.del(email);

      const admin = await this.prisma.admin.findUnique({where: {email}});
      const payload = {id: admin.id, fullName: admin.fullName, role: admin.role}
      const accessToken = await this.jwtService.generateAccessToken(payload);
      const refreshToken = await this.jwtService.generateRefreshToken(payload);
      writeToCookie(metadata, 'refreshToken', refreshToken)

      return { success: true, message: `accessToken: ${accessToken}`}
    } catch (error) {
      return catchError(error)
    }
  }

  async adminLogout(): Promise<AdminLogoutRes> {
    try {
      clearCookie(metadata, 'refreshToken')
      return { success: true, message: 'Admin logged out successfully' }
    } catch (error) {
      return catchError(error)
    }
  }

  async adminFindAll(req: AdminFindAllReq): Promise<AdminFindAllRes> {
    try {
      const { page = 1, limit = 10 } = req;
      const skip = (page - 1) * limit;

      const [admins, total] = await this.prisma.$transaction([
        this.prisma.admin.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        this.prisma.admin.count(),
      ]);

      return {
        total,
        page,
        limit,
        admins,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async adminFindOne(req: AdminFindOneReq): Promise<AdminFindOneRes> {
    try {
      const admin = await this.prisma.admin.findUnique({where: {id: req.id}});
      if(!admin) {
        throw new NotFoundException('Admin not found!')
      }
      return { admin }
    } catch (error) {
      return catchError(error)
    }
  }

  async adminUpdate(req: AdminUpdateReq): Promise<AdminUpdateRes> {
    try {
      const admin = await this.prisma.admin.findUnique({ where: { id: req.id } });
      if (!admin) {
        throw new NotFoundException('Admin not found!');
      }

      const  updateData: any = {};

      if (req.password) {
        updateData.password = await encrypt(req.password);
      }

      if (req.fullName) {
        updateData.fullName = req.fullName;
      }

      if (req.email) {
        updateData.email = req.email;
      }

      if (req.role) {
        updateData.role = req.role;
      }

      await this.prisma.admin.update({
        where: { id: req.id },
        data: updateData,
      });

      const updated = await this.prisma.admin.findUnique({
        where: { id: req.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      });

      return { admin: updated };
    } catch (error) {
      return catchError(error);
    }
  }

  async adminDelete(req: AdminDeleteReq): Promise<AdminDeleteRes> {
    try {
      const admin = await this.prisma.admin.findUnique({where: {id: req.id}})
      if(!admin) {
        throw new NotFoundException('Admin not found!')
      }
      await this.prisma.admin.delete({where: {id: req.id}})
      return {success: true, message: `Admin deleted successfully!`}
    } catch (error) {
      return catchError(error)
    }
  }

  async userLogin(req: UserLoginReq): Promise<UserLoginRes> {
    try {
      const { email, password } = req;

      const user = await this.prisma.user.findUnique({where: {email}});

      if(!user) {
        throw new BadRequestException('Invalid credentials!');
      }

      const isPasswordValid = await decrypt(password, user.password)
      if(!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials!')
      }

      const otp = generateOTP();
      await this.mailService.sendOtp(email, otp)
      await this.cacheManager.set(email, otp, 300000)
      return {otp: otp, message: `OTP send to email ${email}`}
    } catch (error) {
      return catchError(error)
    }
  }

  async userConfirmLogin(req: UserConfirmLoginReq): Promise<UserConfirmLoginRes> {
    try {
      const { email, otp }  = req;
      const hasUser = await this.cacheManager.get(email);
      if(!hasUser || hasUser != otp) {
        throw new BadRequestException('OTP expired!')
      }

      await this.cacheManager.del(email);

      const user = await this.prisma.user.findUnique({where: {email}});
      const payload = {id: user.id, fullName: user.fullName, role: user.role}
      const accessToken = await this.jwtService.generateAccessToken(payload);
      const refreshToken = await this.jwtService.generateRefreshToken(payload);
      writeToCookie(metadata, 'refreshToken', refreshToken)

      return { success: true, message: `accessToken: ${accessToken}`}
    } catch (error) {
      return catchError(error)
    }
  }

  async userSignUp(req: SignUpUserReq): Promise<SignUpUserRes> {
    try {
      const { fullName, email, password } = req;
      const isUserExists = await this.prisma.user.findUnique({where: {email}});
      if(isUserExists) {
        throw new ConflictException('Email already exists!')
      }

      await this.cacheManager.set(email, {fullName, password}, 300000)

      const otp = generateOTP();
      await this.mailService.sendOtp(email, otp)
      await this.cacheManager.set(email, otp, 300000)
      return {otp: otp, message: `OTP send to email ${email}`}
    } catch (error) {
      return catchError(error)
    }
  }
  
  async userConfirmSignUp(req: UserConfirmSignUpReq): Promise<UserConfirmSignUpRes> {
    try {
      const { email, otp }  = req;
      const hasUser = await this.cacheManager.get(email);
      if(!hasUser || hasUser != otp) {
        throw new BadRequestException('OTP expired!')
      }

      await this.cacheManager.del(email);

      const user = await this.prisma.user.findUnique({where: {email}});
      const payload = {id: user.id, fullName: user.fullName, role: user.role}
      const accessToken = await this.jwtService.generateAccessToken(payload);
      const refreshToken = await this.jwtService.generateRefreshToken(payload);
      writeToCookie(metadata, 'refreshToken', refreshToken)

      return { success: true, message: `accessToken: ${accessToken}`}
    } catch (error) {
      return catchError(error)
    }
  }

  async userUpdate(req: UserUpdateReq): Promise<UserUpdateRes> {
    try {
      const isUserExists = await this.prisma.user.findUnique({where: {id: req.id}})
      if(!isUserExists) {
        throw new NotFoundException('User not found!')
      }

      const updatedData: any = {};

      if(req.email) {
        updatedData.email = req.email;
      }

      if(req.fullName) {
        updatedData.fullName = req.fullName
      }

      if(req.phone) {
        updatedData.phone = req.phone
      }

      await this.prisma.user.update({
        where: {id: req.id},
        data: updatedData
      })

      const updated = await this.prisma.user.findUnique({
        where: {id: req.id},
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true
        }
      })
      return {user: updated}
    } catch (error) {
      return catchError(error)
    }
  }

  async userDelete(req: UserDeleteReq): Promise<UserDeleteRes> {
    try {
      const user = await this.prisma.user.findUnique({where: {id: req.id}})
      if(!user) {
        throw new NotFoundException('User not found!')
      }
      await this.prisma.user.delete({where: {id: req.id}})
      return {success: true, message: `User successfully delete by id ${req.id}`}
    } catch (error) {
      return catchError(error)
    }
  }

  async userFindAll(req: UserFindAllReq): Promise<UserFindAllRes> {
    try {
      const { page = 1, limit = 10 } = req;
      const skip = (page - 1) * limit;

      const [ users, total ] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          skip,
          take: limit,
          orderBy: {createdAt: 'desc'},
          select: {
            id:  true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true
          },
        }),
        this.prisma.user.count(),
      ]);

      return {
        total,
        page,
        limit,
        users
      }
    } catch (error) {
      return catchError(error)
    }
  }

  async userFindOne(req: UserFindOneReq): Promise<UserFindOneRes> {
    try {
      const user = await this.prisma.user.findUnique({where: {id: req.id}})
      if(!user) {
        throw new NotFoundException('User not found!')
      }

      return { user }
    } catch (error) {
      return catchError(error)
    }
  }

}