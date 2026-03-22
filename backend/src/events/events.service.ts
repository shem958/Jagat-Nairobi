import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, GeoJSONType } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(
    creatorId: string,
    title: string,
    description: string,
    lat: number,
    lng: number,
    expiresInHours: number,
  ): Promise<Event> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const newEvent = new this.eventModel({
      title,
      description,
      location: {
        type: GeoJSONType.Point,
        coordinates: [lng, lat],
      },
      creatorId,
      attendees: [creatorId], // Creator attends by default
      expiresAt,
    });

    return newEvent.save();
  }

  // Find nearby events within a radius (e.g., in meters)
  async findNearbyEvents(
    lat: number,
    lng: number,
    radiusInMeters: number = 5000,
  ): Promise<Event[]> {
    const now = new Date();
    return this.eventModel
      .find({
        expiresAt: { $gt: now }, // Only active events
        location: {
          $nearSphere: {
            $geometry: {
              type: GeoJSONType.Point,
              coordinates: [lng, lat],
            },
            $maxDistance: radiusInMeters,
          },
        },
      })
      .exec();
  }

  async joinEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.expiresAt < new Date()) {
      throw new BadRequestException('Event has expired');
    }

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
    }

    return event;
  }
}
