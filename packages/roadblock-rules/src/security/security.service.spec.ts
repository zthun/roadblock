import { IZCookie, ZCookieBuilder } from '@zthun/helpful-internet';
import { IZVaultClient, ZVaultClientMemory } from '@zthun/vault-client';
import { IZUser, ZUserBuilder } from '@zthun/works.core';
import { ZCookiesClient, ZUsersClient } from '@zthun/works.microservices';
import { Request } from 'express';
import { v4 } from 'uuid';
import { Mocked, beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZConfigEntries } from '../config/config.module';
import { ZSecurityService } from './security.service';

describe('ZSecurityService', () => {
  let cookie: IZCookie;
  let users: Mocked<ZUsersClient>;
  let user: IZUser;
  let req: Mocked<Request>;
  let cookies: Mocked<ZCookiesClient>;
  let vault: IZVaultClient;

  function createTestTarget() {
    return new ZSecurityService(users, cookies, vault);
  }

  beforeEach(() => {
    cookie = new ZCookieBuilder()
      .domain(ZConfigEntries.common.domain.value)
      .expiresTomorrow()
      .secure()
      .httpOnly()
      .build();

    users = mock();
    users.findByEmail.mockReturnValue(Promise.resolve(null));
    users.findById.mockReturnValue(Promise.resolve(null));
    users.login.mockReturnValue(Promise.resolve(null));

    cookies = mock();
    cookies.createAuthentication.mockResolvedValue(cookie);
    cookies.whoIs.mockResolvedValue(null);

    vault = new ZVaultClientMemory();

    user = new ZUserBuilder().email('wolverine@marvel.com').password('foo').id('0').super().build();
    users.findById.mockReturnValue(Promise.resolve(user));
    cookies.whoIs.mockResolvedValue(user._id);
    req = mock();
  });

  it('should extract the user from the auth cookie in the request.', async () => {
    // Arrange
    const target = createTestTarget();
    const cookie = new ZCookieBuilder().authentication(v4()).domain(ZConfigEntries.common.domain.value).build();
    req.cookies[cookie.name] = cookie.value;
    // Act
    const actual = await target.extract(req);
    // Assert
    expect(actual).toEqual(user);
  });

  it('should return falsy if the token cannot be extracted.', async () => {
    // Arrange
    const target = createTestTarget();
    cookies.whoIs.mockResolvedValue(null);
    // Act
    const actual = await target.extract(req);
    // Assert
    expect(actual).toBeFalsy();
  });
});
