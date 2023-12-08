import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'sum' })
  async accumulate(data: number[]): Promise<number> {
    console.log('calculating sum...');
    return this.appService.getSum(data);
  }

  @MessagePattern({ cmd: 'mult' })
  async multipry(data: number[]): Promise<number> {
    console.log('calculating mult...');
    return this.appService.getMult(data);
  }

  @EventPattern('event_connect')
  async connectBybit(): Promise<void> {
    console.log('connecting...');
    this.appService.connectToBybit();
  }

  @EventPattern('event_disconnect')
  async disconnectBybit(): Promise<void> {
    console.log('disconnecting...');
    this.appService.disconnectFromBybit();
  }

  @EventPattern('event_reconnect')
  async reconnectBybit(): Promise<void> {
    console.log('reconnecting...');
    this.appService.reconnectBybit();
  }
}
