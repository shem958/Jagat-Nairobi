import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsNumber()
  @Min(1)
  expiresInHours: number;
}

export class NearbyEventsQueryDto {
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lng: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  radius?: number;
}

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(
      req.user.uid,
      createEventDto.title,
      createEventDto.description,
      createEventDto.lat,
      createEventDto.lng,
      createEventDto.expiresInHours,
    );
  }

  @Get('nearby')
  async getNearbyEvents(@Query() query: NearbyEventsQueryDto) {
    return this.eventsService.findNearbyEvents(query.lat, query.lng, query.radius);
  }

  @Post(':id/join')
  async joinEvent(@Request() req, @Param('id') eventId: string) {
    return this.eventsService.joinEvent(eventId, req.user.uid);
  }
}
