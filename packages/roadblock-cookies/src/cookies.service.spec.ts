import { IZUser, ZUserBuilder } from '@zthun/works.core';
import { v4 } from 'uuid';
import { beforeEach, describe, expect, it } from 'vitest';
import { ZCookiesService } from './cookies.service';

describe('ZCookiesService', () => {
  let user: IZUser;
  let secret: string;

  function createTestTarget() {
    return new ZCookiesService();
  }

  beforeEach(() => {
    user = new ZUserBuilder().id(v4()).email('gambit@marvel.com').build();
    secret = v4();
  });

  describe('Create Authentication Token', () => {
    it('should return a truthy cookie value.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.createAuthentication({ user, secret });
      // Assert
      expect(actual.value).toBeTruthy();
    });

    it('should return a rejected cookie if the user is invalid.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = target.createAuthentication({ user: new ZUserBuilder().build(), secret });
      // Assert
      await expect(actual).rejects.toBeTruthy();
    });

    it('should return a rejected promise if the secret is falsy.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = target.createAuthentication({ user, secret: '' });
      // Assert
      await expect(actual).rejects.toBeTruthy();
    });

    it('should return a secure cookie.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.createAuthentication({ user, secret });
      // Assert
      expect(actual.secure).toBeTruthy();
    });

    it('should return a cookie that cannot be read by JavaScript.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.createAuthentication({ user, secret });
      // Assert
      expect(actual.httpOnly).toBeTruthy();
    });

    it('should scope the domain of the cookie.', async () => {
      // Arrange
      const domain = 'zthunworks.com';
      const target = createTestTarget();
      // Act
      const actual = await target.createAuthentication({ user, secret, domain });
      // Assert
      expect(actual.domain).toEqual(domain);
    });
  });

  describe('Who Is', () => {
    it('should return the user id from the given jwt.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const cookie = await target.createAuthentication({ user, secret });
      const id = await target.whoIs({ jwt: cookie.value, secret });
      // Assert
      expect(id).toEqual(user._id);
    });

    it('should return null if the jwt is falsy.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.whoIs({ jwt: '', secret });
      // Assert
      expect(actual).toBeNull();
    });

    it('should return null if the secret is wrong.', async () => {
      // Arrange
      const target = createTestTarget();
      const wrong = 'not-the-right-secret';
      const cookie = await target.createAuthentication({ user, secret });
      // Act
      const actual = await target.whoIs({ jwt: cookie.value, secret: wrong });
      // Assert
      expect(actual).toBeNull();
    });
  });
});
