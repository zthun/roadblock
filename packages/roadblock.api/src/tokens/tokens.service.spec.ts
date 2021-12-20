/* eslint-disable require-jsdoc */
import { IZConfigEntry, IZCookie, IZLogin, IZUser, ZConfigEntryBuilder, ZCookieBuilder, ZLoginBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { ZCookiesClient, ZUsersClient } from '@zthun/works.microservices';
import { ZWorksConfigService } from '@zthun/works.nest';
import { Response } from 'express';
import { v4 } from 'uuid';
import { ZTokensService } from './tokens.service';

describe('ZTokensService', () => {
  let secret: IZConfigEntry<string>;
  let domain: IZConfigEntry<string>;
  let cookie: IZCookie;
  let users: jest.Mocked<ZUsersClient>;
  let cookies: jest.Mocked<ZCookiesClient>;
  let config: jest.Mocked<ZWorksConfigService>;

  function createTestTarget() {
    return new ZTokensService(users, cookies, config);
  }

  beforeEach(() => {
    secret = new ZConfigEntryBuilder().scope(ZWorksConfigService.SCOPE_COOKIES).key(ZWorksConfigService.KEY_COOKIES_SECRET).generate().build();
    domain = new ZConfigEntryBuilder().scope(ZWorksConfigService.SCOPE_COMMON).key(ZWorksConfigService.KEY_COMMON_DOMAIN).value('marvel.com').build();
    cookie = new ZCookieBuilder().domain(domain.value).expiresTomorrow().secure().httpOnly().build();

    users = createMocked(['findByEmail', 'findById', 'login']);
    users.findByEmail.mockReturnValue(Promise.resolve(null));
    users.findById.mockReturnValue(Promise.resolve(null));
    users.login.mockReturnValue(Promise.resolve());

    cookies = createMocked(['createAuthentication', 'whoIs']);
    cookies.createAuthentication.mockResolvedValue(cookie);
    cookies.whoIs.mockResolvedValue(null);

    config = createMocked<ZWorksConfigService>(['domain', 'secret']);
    config.domain.mockResolvedValue(domain);
    config.secret.mockResolvedValue(secret);
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
      const expected = new ZCookieBuilder().authentication().immortal().domain(domain.value).build();
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
