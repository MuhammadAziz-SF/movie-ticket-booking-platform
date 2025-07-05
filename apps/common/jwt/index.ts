import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {config} from '../config';
import { Request } from 'express'




@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken = async (payload: object) => {
    return await this.jwtService.signAsync(payload, {
      secret: config.ACCESS_TOKEN_KEY,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
  };

  generateRefreshToken = async (payload: object) => {
    return await this.jwtService.signAsync(payload, {
      secret: config.REFRESH_TOKEN_KEY,
      expiresIn: config.REFRESH_TOKEN_TIME,
    });
  };

    decodeJwt = async (req: Request) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded) {
            throw new UnauthorizedException('Invalid token');
            }
            return decoded;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new UnauthorizedException('Failed to decode token');
        }
    }
}
