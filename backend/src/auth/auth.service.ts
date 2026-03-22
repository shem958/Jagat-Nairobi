import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyFirebaseTokenAndLogin(idToken: string) {
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }

    const { uid, name, picture } = decodedToken;

    // Upsert user in our database
    const user = await this.usersService.upsertUser(uid, name || 'User', picture);

    // Generate JWT
    const payload = { uid: user.uid, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
