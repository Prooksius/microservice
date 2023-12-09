import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Argument, Result, ResultOperation } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('MathService', 'Accumulate')
  accumulate(data: Argument): Result {
    console.log('calculating sum...');
    return this.appService.getSum(data);
  }

  @GrpcMethod('MathService', 'Multiply')
  multiply(data: Argument): Result {
    console.log('calculating mult...');
    return this.appService.getMult(data);
  }

  @GrpcMethod('MathService', 'ConnectBybit')
  connectBybit(): ResultOperation {
    console.log('connecting...');
    this.appService.connectToBybit();
    return { success: true };
  }

  @GrpcMethod('MathService', 'DisconnectBybit')
  disconnectBybit(): ResultOperation {
    console.log('disconnecting...');
    this.appService.disconnectFromBybit();
    return { success: true };
  }

  @GrpcMethod('MathService', 'ReconnectBybit')
  reconnectBybit(): ResultOperation {
    console.log('reconnecting...');
    this.appService.reconnectBybit();
    return { success: true };
  }
}
