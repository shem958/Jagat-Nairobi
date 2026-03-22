import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.split(' ')[1] || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      
      const payload = this.jwtService.verify(token);
      client.data.user = payload; // { uid, sub }
      
      // optionally join a user-specific room
      client.join(payload.uid);
      console.log(`Client connected: ${client.id} (uid: ${payload.uid})`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('location:update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number; lng: number },
  ) {
    const uid = client.data.user.uid;
    // Update in DB
    await this.usersService.updateLocation(uid, data.lat, data.lng);

    // Broadcast to others (for MVP, broadcasting globally, or could be area-based)
    client.broadcast.emit('location:updated', { uid, lat: data.lat, lng: data.lng });
    return { event: 'location:update:ack', data: { success: true } };
  }

  // Not strictly an incoming message, but we can emit this from our controllers if needed,
  // or listen for clients explicitly sending it.
  @SubscribeMessage('event:join')
  async handleEventJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string },
  ) {
    // Client joins event specific room
    client.join(`event_${data.eventId}`);
    
    // Broadcast to the room that a user joined
    this.server.to(`event_${data.eventId}`).emit('event:joined', {
      eventId: data.eventId,
      userId: client.data.user.uid,
    });
  }
}
