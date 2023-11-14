import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IZCookie, ZCookieBuilder } from '@zthun/helpful-internet';
import { IZUser } from '@zthun/works.core';
import { SignOptions, sign, verify } from 'jsonwebtoken';

@Controller()
/**
 * Represents a service that creates the auth cookie
 */
export class ZCookiesService {
  /**
   * Creates an auth cookie for a given user.
   *
   * The auth cookie basically contains a user id that is signed with a given secret.
   * This cookie can optionally be validated against a domain.  This cookie will always be secure,
   * not be readable by javascript, and will expire in 24 hours.
   *
   * @param param0 The data payload that contains the user id, secret, and optional domain to use when constructing the cookie.
   *
   * @returns A promise that resolves with the auth cookie.
   */
  @MessagePattern({ cmd: 'createAuthentication' })
  public async createAuthentication({
    user,
    domain,
    secret
  }: {
    user: IZUser;
    domain?: string;
    secret: string;
  }): Promise<IZCookie> {
    const options: SignOptions = {
      expiresIn: '24h'
    };

    if (!user._id) {
      return Promise.reject(new Error('User is not a valid user'));
    }

    const payload = { user: user._id };

    return new Promise((resolve, reject) => {
      sign(payload, secret, options, (err: Error | null, jwt: string) => {
        if (err) {
          reject(err);
        }
        resolve(new ZCookieBuilder().authentication(jwt).domain(domain).build());
      });
    });
  }

  /**
   * Extracts the user id from the cookie value.
   *
   * @param param0 The data payload that contains the jwt value and the secret that was used to sign the token.
   *
   * @returns A promise that, when resolved, returns the user id for the jwt.  If the token is no longer valid,
   *          or has expired, then null is returned.
   */
  @MessagePattern({ cmd: 'whoIs' })
  public async whoIs({ jwt, secret }: { jwt: string; secret: string }): Promise<string | null> {
    return new Promise((resolve) => {
      verify(jwt, secret, (err: Error | null, decoded: { user: string } | undefined) => {
        if (err) {
          resolve(null);
        }
        resolve(decoded?.user || null);
      });
    });
  }
}
