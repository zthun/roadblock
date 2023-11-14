/* eslint-disable require-jsdoc */
import { IZCookie, IZLogin, IZUser, ZCookieBuilder, ZLoginBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { ZCookiesClient, ZUsersClient, ZVaultMemoryClient } from '@zthun/works.microservices';
import { ZConfigEntries } from '@zthun/works.nest';
import { Response } from 'express';
import { v4 } from 'uuid';
import { ZTokensService } from './tokens.service';

describe('ZTokensService', () => {
  let cookie: IZCookie;
  let users: jest.Mocked<ZUsersClient>;
  let cookies: jest.Mocked<ZCookiesClient>;
  let vault: ZVaultMemoryClient;

  function createTestTarget() {
    return new ZTokensService(users, cookies, vault);
  }

  beforeEach(() => {
    vault = new ZVaultMemoryClient();
    cookie = new ZCookieBuilder().domain(ZConfigEntries.common.domain.value).expiresTomorrow().secure().httpOnly().build();

    users = createMocked(['findByEmail', 'findById', 'login']);
    users.findByEmail.mockReturnValue(Promise.resolve(null));
    users.findById.mockReturnValue(Promise.resolve(null));
    users.login.mockReturnValue(Promise.resolve());

    cookies = createMocked(['createAuthentication', 'whoIs']);
    cookies.createAuthentication.mockResolvedValue(cookie);
    cookies.whoIs.mockResolvedValue(null);
  });

  describe('Inject', () => {
    let res: jest.Mocked<Response>;
    let credentials: IZLogin;
    let user: IZUser;

    beforeEach(() => {
      credentials = new ZLoginBuilder().email('gambit@marvel.com').password('not-very-secure').autoConfirm().build();
      user = new ZUserBuilder().email(credentials.email).id(v4()).build();

      users.findByEmail.mockReturnValue(Promise.resolve(user));

      res = createMocked<Response>(['cookie', 'clearCookie']);
      res.cookie.mockReturnValue(res);
    });

    it('should inject the auth token into the response.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.inject(res, credentials);
      // Assert
      expect(res.cookie).toHaveBeenCalled();
    });

    it('should clear the auth token.', async () => {
      // Arrange
      const target = createTestTarget();
      const expected = new ZCookieBuilder().authentication().immortal().domain(ZConfigEntries.common.domain.value).build();
      // Act
      await target.clear(res);
      // Assert
      expect(res.clearCookie).toHaveBeenCalledWith(expected.name, expect.objectContaining(expected));
    });

    it('should timestamp the user login.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.inject(res, credentials);
      // Assert
      expect(users.login).toHaveBeenCalledWith(user._id);
    });
  });
});
