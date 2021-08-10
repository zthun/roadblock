/* eslint-disable require-jsdoc */
import { IZConfigEntry, IZLogin, IZUser, ZConfigEntryBuilder, ZLoginBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { ZCommonConfigService } from '@zthun/works.nest';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ZUsersService } from '../../users/users.service';
import { ZAuthConfigService } from '../config/auth-config.service';
import { ZTokensService } from './tokens.service';

describe('ZTokensService', () => {
  let secret: IZConfigEntry<string>;
  let domain: IZConfigEntry<string>;
  let users: jest.Mocked<ZUsersService>;
  let commonConfig: jest.Mocked<ZCommonConfigService>;
  let authConfig: jest.Mocked<ZAuthConfigService>;

  function createTestTarget() {
    return new ZTokensService(users, commonConfig, authConfig);
  }

  beforeEach(() => {
    secret = new ZConfigEntryBuilder().scope(ZAuthConfigService.SCOPE).key(ZAuthConfigService.KEY_JWT).generate().build();
    domain = new ZConfigEntryBuilder().scope(ZCommonConfigService.SCOPE).key(ZCommonConfigService.KEY_DOMAIN).value('marvel.com').build();

    users = createMocked(['findByEmail', 'findById', 'login']);
    users.findByEmail.mockReturnValue(Promise.resolve(null));
    users.findById.mockReturnValue(Promise.resolve(null));
    users.login.mockReturnValue(Promise.resolve());

    commonConfig = createMocked<ZCommonConfigService>(['domain']);
    commonConfig.domain.mockReturnValue(Promise.resolve(domain));

    authConfig = createMocked<ZAuthConfigService>(['jwt']);
    authConfig.jwt.mockReturnValue(Promise.resolve(secret));
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
      // Act
      await target.clear(res);
      // Assert
      expect(res.clearCookie).toHaveBeenCalledWith(ZTokensService.COOKIE_NAME, expect.objectContaining({ secure: true, sameSite: true, httpOnly: true, domain: domain.value }));
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

  describe('Extract', () => {
    let user: IZUser;
    let req: jest.Mocked<Request>;

    beforeEach(() => {
      user = new ZUserBuilder().email('wolverine@marvel.com').password('foo').id('0').super().build();
      users.findById.mockReturnValue(Promise.resolve(user));
      req = createMocked(['cookies']);
    });

    it('should extract the user from the auth cookie in the request.', async () => {
      // Arrange
      const target = createTestTarget();
      const jwt = await target.sign({ user: user.email }, secret.value);
      req.cookies[ZTokensService.COOKIE_NAME] = jwt;
      // Act
      const actual = await target.extract(req);
      // Assert
      expect(actual).toEqual(user);
    });

    it('should return falsy if the token cannot be extracted.', async () => {
      // Arrange
      const target = createTestTarget();
      users.findByEmail.mockRejectedValue('failed');
      // Act
      const actual = await target.extract(req);
      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('Sign and verify', () => {
    let payload: object;

    beforeEach(() => {
      payload = {
        user: '1234',
        food: 'burger'
      };
    });

    it('should create a signed token with the correct signature.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const token = await target.sign(payload, secret.value);
      const actual = await target.verify(token, secret.value);
      // Assert
      expect(actual).toEqual(expect.objectContaining(payload));
    });

    it('should reject a signature if the payload is falsy.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = target.sign(null, secret.value);
      // Assert
      await expect(actual).rejects.toBeTruthy();
    });

    it('should reject a signature if the secret is falsy.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = target.sign(payload, null);
      // Assert
      await expect(actual).rejects.toBeTruthy();
    });

    it('should reject a token that is not decoded with the correct secret.', async () => {
      // Arrange
      const target = createTestTarget();
      const wrong = 'not-the-right-secret';
      // Act
      const token = await target.sign(payload, secret.value);
      const actual = target.verify(token, wrong);
      // Assert
      await expect(actual).rejects.toBeTruthy();
    });
  });
});
