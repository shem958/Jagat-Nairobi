import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum GeoJSONType {
  Point = 'Point',
}

@Schema({ _id: false })
export class GeoJSONPoint {
  @Prop({ type: String, enum: GeoJSONType, default: GeoJSONType.Point, required: true })
  type: GeoJSONType;

  // [longitude, latitude]
  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: GeoJSONPoint, required: true, index: '2dsphere' })
  location: GeoJSONPoint;

  @Prop({ required: true })
  creatorId: string; // User uid

  @Prop({ type: [String], default: [] })
  attendees: string[]; // User uids

  @Prop({ required: true })
  expiresAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
