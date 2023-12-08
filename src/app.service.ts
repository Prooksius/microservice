import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import * as WebSocketClient from 'websocket';

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  protected wsClient: WebSocketClient.client;
  private connection: WebSocketClient.connection;

  onApplicationShutdown(signal?: string) {
    console.log('onApplicationShutdown');
    if (this.connection.connected) {
      this.disconnectFromBybit();
    }
  }

  onApplicationBootstrap() {
    this.wsClient = new WebSocketClient.client();
    this.wsClient.on('connectFailed', (error) => this.onConnectFailed(error));
    this.wsClient.on('connect', (connection) => this.onConnect(connection));
    console.log('...bootstrapped');
    //this.connectToBybit();
  }

  disconnectFromBybit() {
    this.connection.close();
    this.connection = null;
  }

  reconnectBybit() {
    if (this.connection?.connected) {
      this.connection.close();
      this.connection = null;
    }
    setTimeout(() => {
      this.connectToBybit();
    }, 1000);
  }

  connectToBybit() {
    this.wsClient.connect('wss://stream.bybit.com/contract/usdt/public/v3');
  }

  private onConnect(connection: WebSocketClient.connection) {
    console.log('WebSocket Client Connected');
    this.connection = connection;

    connection.on('error', (error) => this.onError(error));
    connection.on('close', () => this.onClose());
    connection.on('message', (message) => this.onMessage(message));

    setTimeout(() => {
      connection.send(
        JSON.stringify({ op: 'subscribe', args: ['tickers.BTCUSDT'] }),
      );
    }, 100);
  }

  private onClose() {
    console.log('echo-protocol Connection Closed');
    this.connection = null;
  }
  private onError(error: Error) {
    console.log('Connection Error: ' + error.toString());
    this.disconnectFromBybit();
    setTimeout(() => this.connectToBybit(), 5000);
  }
  private onConnectFailed(error: Error) {
    console.log('Connection Error: ' + error.toString());
  }

  private onMessage(message: WebSocketClient.Message) {
    if (message.type === 'utf8') {
      const msg = JSON.parse(message.utf8Data);
      const price =
        msg?.data?.lastPrice || msg?.data?.markPrice || msg?.data?.indexPrice;

      if (typeof price !== 'undefined') {
        console.log(msg?.data?.symbol + '- ', price);
      }
    }
  }

  async getSum(data: number[]): Promise<number> {
    const result = data.reduce((sum, item) => sum + item, 0);
    return result;
  }

  async getMult(data: number[]): Promise<number> {
    const result = data.reduce((sum, item) => sum * item, 1);
    return result;
  }
}
