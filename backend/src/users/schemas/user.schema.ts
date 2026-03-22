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
export class User extends Document {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: false })
  photoUrl?: string;

  @Prop({ type: GeoJSONPoint, required: false, index: '2dsphere' })
  lastLocation?: GeoJSONPoint;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
