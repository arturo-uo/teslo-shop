import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service'
import { Socket, Server } from 'socket.io'
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id)
    }
    catch (error) {
      client.disconnect()
      return
    }
    //console.log({ payload })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClient())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClient())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no message'
    // })

    //Emite a todos, menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no message'
    // })

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message'
    })
  }
}
