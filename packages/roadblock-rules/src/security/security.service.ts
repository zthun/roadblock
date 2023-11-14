import { Inject, Injectable } from '@nestjs/common';
import { ZCookieBuilder } from '@zthun/helpful-internet';
import { IZVaultClient, ZVaultToken } from '@zthun/vault-client';
import { IZUser } from '@zthun/works.core';
import { ZCookiesClient, ZUsersClient } from '@zthun/works.microservices';
import { Request } from 'express';
import { get } from 'lodash';
import { ZConfigEntries } from '../config/config.module';

@Injectable()
/**
 * Represents a service that can be used to sign, verify, inject and extract a jwt token.
 *
 * This is a helper service that combines the ZUsersClient and ZCookiesClient to extract the
 * user from the cookie auth token.  It's possible to do this without this service, but this
 * service makes it much easier to do.
 */
export class ZSecurityService {
  /**
   * Initializes a new instance of this object.
   *
   * @param _users The user repository for retrieving and updating users.
   * @param _cookies The cookies client for retrieving cookies.
   * @param _commonConfig The common configuration service that contains core values.
   * @param _authConfig The auth configuration service that contains auth options.
   */
  public constructor(
    private readonly _users: ZUsersClient,
    private readonly _cookies: ZCookiesClient,
    @Inject(ZVaultToken) private readonly _vault: IZVaultClient
  ) {}

  /**
   * Extracts a user from a request object.
   *
   * @param req The request to extract the user from.
   *
   * @returns A promise that, when resolved, has extracted the user.
   */
  public async extract(req: Request): Promise<IZUser | null> {
    const cookie = new ZCookieBuilder().authentication().build();
    const jwt = get(req, `cookies[${cookie.name}]`);
    const { value: secret } = await this._vault.get(ZConfigEntries.identity.secret);
    const id = await this._cookies.whoIs(jwt, secret);
    return id == null ? null : this._users.findById(id);
  }
}
