import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IZCookie } from '@zthun/helpful-internet';
import { IZUser } from '@zthun/works.core';
import { lastValueFrom } from 'rxjs';

@Injectable()
/**
 * Represents a service to constructs the authentication cookie.
 */
export class ZCookiesClient {
  /**
   * Initializes a new instance of this object.
   *
   * @param _cookies The client proxy to access the microservice over transport.
   */
  public constructor(@Inject('Cookies.Service') private readonly _cookies: ClientProxy) {}

  /**
   * Creates an auth cookie for a given user.
   *
   * The auth cookie basically contains a user id that is signed with a given secret.
   * This cookie can optionally be validated against a domain.  This cookie will always be secure,
   * not be readable by javascript, and will expire in 24 hours.
   *
   * @param user The user to authenticate.
   * @param secret The secret to sign the token with.
   * @param domain The optional domain to scope the cookie to.
   *
   * @returns A promise that resolves with the auth cookie.
   */
  public async createAuthentication(user: IZUser, secret: string, domain?: string): Promise<IZCookie> {
    return lastValueFrom(this._cookies.send({ cmd: 'createAuthentication' }, { user, secret, domain }));
  }

  /**
   * Extracts the user id from the cookie value.
   *
   * @param jwt The jwt token from the authentication cookie.
   * @param secret The secret that the token was signed with.
   *
   * @returns A promise that, when resolved, returns the user id for the jwt.  If the token is no longer valid,
   *          or has expired, then null is returned.
   */
  public async whoIs(jwt: string, secret: string): Promise<string | null> {
    return lastValueFrom(this._cookies.send({ cmd: 'whoIs' }, { jwt, secret }));
  }
}
