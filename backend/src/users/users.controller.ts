import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNumber } from 'class-validator';

export class UpdateLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findByUid(req.user.uid);
  }

  @Patch('location')
  async updateLocation(@Request() req, @Body() updateLocationDto: UpdateLocationDto) {
    return this.usersService.updateLocation(
      req.user.uid,
      updateLocationDto.lat,
      updateLocationDto.lng,
    );
  }
}
