import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IZRoadblockTokensService } from './tokens.service';

@Injectable()
/**
 * Represents a service proxy for the token service.
 */
export class ZRoadblockTokensServiceProxy implements IZRoadblockTokensService {
  public static readonly INJECTION_TOKEN = 'ROADBLOCK_TOKENS_SERVICE_PROXY';

  /**
   * Initializes a new instance of this object.
   *
   * @param _proxy The client proxy that can be used to send messages to the token service.
   */
  public constructor(@Inject(ZRoadblockTokensServiceProxy.INJECTION_TOKEN) private _proxy: ClientProxy) {}

  /**
   * Verifies a token.
   *
   * @param jwt The token to verify.
   *
   * @returns A promise that resolves with the response or rejects with a connection failure.
   */
  public verify(jwt: string): Promise<boolean> {
    return lastValueFrom(this._proxy.send({ cmd: 'verify' }, jwt));
  }

  /**
   * Creates a jwt.
   *
   * @returns A promise with the created jwt.
   */
  public create(): Promise<any> {
    return lastValueFrom(this._proxy.send({ cmd: 'create' }, {}));
  }
}
