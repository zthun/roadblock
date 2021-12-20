import { Injectable } from '@nestjs/common';
import { IZLogin, IZUser } from '@zthun/works.core';
import { ZCommonConfigService, ZUsersService } from '@zthun/works.nest';
import { CookieOptions, Request, Response } from 'express';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { get } from 'lodash';
import { ZAuthConfigService } from '../config/auth-config.service';

@Injectable()
/**
 * Represents a service that can be used to sign, verify, inject and extract a jwt token.
 */
export class ZTokensService {
  /**
   * The name of the cookie that this service will inject.
   */
  public static readonly COOKIE_NAME = 'Authentication';

  /**
   * Initializes a new instance of this object.
   *
   * @param _users The user repository for retrieving and updating users.
   * @param _commonConfig The common configuration service that contains core values.
   * @param _authConfig The auth configuration service that contains auth options.
   */
  public constructor(private readonly _users: ZUsersService, private readonly _commonConfig: ZCommonConfigService, private readonly _authConfig: ZAuthConfigService) {}

  /**
   * Injects the jwt with the appropriate credentials into the response object.
   *
   * @param res The response object to inject the cookie into.
   * @param credentials The login credentials that contain the email to inject.
   *
   * @returns A promise that, when resolved, has injected the cookie.
   */
  public async inject(res: Response, credentials: IZLogin) {
    const oneDay = 86400000;
    const secret = await this._authConfig.jwt();
    const tomorrow = new Date(Date.now() + oneDay);
    const options = await this._cookieOptions(tomorrow);
    const { _id } = await this._users.findByEmail(credentials.email);
    const jwt = await this.sign({ user: _id }, secret.value);
    await this._users.login(_id);
    res.cookie(ZTokensService.COOKIE_NAME, jwt, options);
  }

  /**
   * Extracts a user from a request object.
   *
   * @param req The request to extract the user from.
   *
   * @returns A promise that, when resolved, has extracted the user.
   */
  public async extract(req: Request): Promise<IZUser> {
    try {
      const token = get(req, `cookies[${ZTokensService.COOKIE_NAME}]`);
      const secret = await this._authConfig.jwt();
      const payload: { user: string } = await this.verify(token, secret.value);
      const user = await this._users.findById(payload.user);
      return user;
    } catch (err) {
      return null;
    }
  }

  /**
   * Clears the authentication cookie from the response.
   *
   * @param res The response to clear the cookie from.
   *
   * @returns A promise that, when resolved, has cleared the auth cookie.
   */
  public async clear(res: Response) {
    const options = await this._cookieOptions();
    res.clearCookie(ZTokensService.COOKIE_NAME, options);
  }

  /**
   * Signs a token and returns the token string.
   *
   * @param payload The payload object to convert to a jwt token.
   * @param secret The secret to use when signing the token.
   *
   * @returns A promise that, when resolved, has returned the signed token.
   */
  public async sign(payload: object, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: SignOptions = {
        expiresIn: '24h'
      };
      sign(payload, secret, options, (err: Error | null, jwt: string | undefined) => {
        if (err) {
          reject(err);
        }
        resolve(jwt);
      });
    });
  }

  /**
   * Verifies a token.
   *
   * @param token The token to validate.
   * @param secret The secret jwt key.
   *
   * @returns A promise that, when resolved, returns the payload.  Returns a rejected promise if the
   *          token is not valid or has expired.
   */
  public async verify(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      verify(token, secret, (err: Error | null, decoded: object | undefined) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }

  /**
   * Gets the options for a cookie.
   *
   * @param expires The expiration date for the cookie.
   *
   * @returns The options for a cookie.
   */
  private async _cookieOptions(expires?: Date): Promise<CookieOptions> {
    const domain = await this._commonConfig.domain();
    const base = { secure: true, httpOnly: true, domain: domain.value, sameSite: true };
    return expires ? Object.assign(base, { expires }) : base;
  }
}
