import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyFirebaseTokenAndLogin(verifyTokenDto.idToken);
  }
}
