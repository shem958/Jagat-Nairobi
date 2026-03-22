import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, GeoJSONType } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async upsertUser(uid: string, displayName: string, photoUrl?: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { uid },
      { $set: { displayName, photoUrl } },
      { new: true, upsert: true }
    );
    return user;
  }

  async findByUid(uid: string): Promise<User | null> {
    return this.userModel.findOne({ uid }).exec();
  }

  async updateLocation(uid: string, lat: number, lng: number): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { uid },
      {
        $set: {
          lastLocation: {
            type: GeoJSONType.Point,
            coordinates: [lng, lat],
          },
        },
      },
      { new: true }
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
