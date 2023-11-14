import { Injectable } from '@nestjs/common';
import { IZLogin, ZCookieBuilder } from '@zthun/works.core';
import { ZCookiesClient, ZUsersClient, ZVaultClient } from '@zthun/works.microservices';
import { ZConfigEntries } from '@zthun/works.nest';
import { CookieOptions, Response } from 'express';

@Injectable()
/**
 * Represents a service that can be used to sign, verify, inject and extract a jwt token.
 */
export class ZTokensService {
  /**
   * Initializes a new instance of this object.
   *
   * @param _users The users client.
   * @param _cookies The cookies client.
   * @param _vault The vault client.
   */
  public constructor(private readonly _users: ZUsersClient, private readonly _cookies: ZCookiesClient, private readonly _vault: ZVaultClient) {}

  /**
   * Injects the jwt with the appropriate credentials into the response object.
   *
   * @param res The response object to inject the cookie into.
   * @param credentials The login credentials that contain the email to inject.
   *
   * @returns A promise that, when resolved, has injected the cookie.
   */
  public async inject(res: Response, credentials: IZLogin) {
    const user = await this._users.findByEmail(credentials.email);
    const { value: secret } = await this._vault.get(ZConfigEntries.identity.secret);
    const { value: domain } = await this._vault.get(ZConfigEntries.common.domain);
    const cookie = await this._cookies.createAuthentication(user, secret, domain);
    await this._users.login(user._id);
    const expires = new Date(cookie.expires);
    res.cookie(cookie.name, cookie.value, { ...cookie, expires });
  }

  /**
   * Clears the authentication cookie from the response.
   *
   * @param res The response to clear the cookie from.
   *
   * @returns A promise that, when resolved, has cleared the auth cookie.
   */
  public async clear(res: Response) {
    const { value: domain } = await this._vault.get(ZConfigEntries.common.domain);
    const cookie = new ZCookieBuilder().authentication().immortal().domain(domain).build();
    res.clearCookie(cookie.name, cookie as unknown as CookieOptions);
  }
}
