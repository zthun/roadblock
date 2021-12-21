/* eslint-disable require-jsdoc */
import { IZProfile, ZLoginBuilder, ZProfileActivationBuilder, ZProfileBuilder } from '@zthun/works.core';
import { IZHttpRequest, ZHttpCodeSuccess, ZHttpMethod, ZHttpResultBuilder, ZHttpServiceMock } from '@zthun/works.http';
import { v4 } from 'uuid';
import { ZProfileService } from './profile-service.context';

describe('ZProfileService', () => {
  let http: ZHttpServiceMock;
  let profile: IZProfile;
  let avatar: string;

  function createTestTarget() {
    return new ZProfileService(http);
  }

  beforeEach(() => {
    avatar = 'data:text/plain;Avatar';
    profile = new ZProfileBuilder().email('gambit@marvel.com').display('Gambit').avatar(avatar).build();
    http = new ZHttpServiceMock();
  });

  describe('Create', () => {
    beforeEach(() => {
      http.set(ZProfileService.createProfilesUrl(), ZHttpMethod.Post, new ZHttpResultBuilder().data(profile).build());
    });

    it('should create a new account.', async () => {
      // Arrange
      const target = createTestTarget();
      const credentials = new ZLoginBuilder().email(profile.email).password('crappy-password').autoConfirm().build();
      // Act
      const actual = await target.create(credentials);
      // Assert
      expect(actual).toEqual(profile);
    });
  });

  describe('Read', () => {
    beforeEach(() => {
      http.set(ZProfileService.createProfilesUrl(), ZHttpMethod.Get, new ZHttpResultBuilder().data(profile).build());
    });

    it('should return the profile on successful read.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.read();
      // Assert
      expect(actual).toEqual(profile);
    });
  });

  describe('Update', () => {
    beforeEach(() => {
      http.set(ZProfileService.createProfilesUrl(), ZHttpMethod.Put, (req: IZHttpRequest<Partial<IZProfile>>) => {
        const updated = new ZProfileBuilder().copy(profile).assign(req.body).build();
        const res = new ZHttpResultBuilder().data(updated).status(ZHttpCodeSuccess.OK).build();
        return Promise.resolve(res);
      });
    });

    it('should return the updated profile.', async () => {
      // Arrange
      const target = createTestTarget();
      const update: Partial<IZProfile> = { display: 'Logan' };
      const expected = new ZProfileBuilder().copy(profile).assign(update).build();
      // Act
      const actual = await target.update(update);
      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      http.set(ZProfileService.createProfilesUrl(), ZHttpMethod.Delete, new ZHttpResultBuilder().data(null).status(ZHttpCodeSuccess.OK).build());
    });

    it('should delete the profile.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.delete().catch((err) => Promise.resolve(err));
      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      http.set(ZProfileService.createProfilesUrl(), ZHttpMethod.Get, new ZHttpResultBuilder().data(profile).status(ZHttpCodeSuccess.OK).build());
      http.set(ZProfileService.createTokensUrl(), ZHttpMethod.Post, new ZHttpResultBuilder().data(null).status(ZHttpCodeSuccess.OK).build());
    });

    it('should return the profile that was successfully logged in.', async () => {
      // Arrange
      const target = createTestTarget();
      const credentials = new ZLoginBuilder().email('gambit@marvel.com').password('crappy-password').build();
      // Act
      const actual = await target.login(credentials);
      // Assert
      expect(actual).toEqual(profile);
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      http.set(ZProfileService.createTokensUrl(), ZHttpMethod.Delete, new ZHttpResultBuilder().status(ZHttpCodeSuccess.OK).build());
    });

    it('should log the user out from the system.', async () => {
      // Arrange
      const target = createTestTarget();
      http.set(ZProfileService.createTokensUrl(), ZHttpMethod.Delete, new ZHttpResultBuilder().data(true).status(ZHttpCodeSuccess.OK).build());
      // Act
      const actual = await target.logout();
      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe('Recovery', () => {
    beforeEach(() => {
      http.set(ZProfileService.createRecoveryUrl(), ZHttpMethod.Post, new ZHttpResultBuilder().status(ZHttpCodeSuccess.Created).build());
    });

    it('should send the recovery email.', async () => {
      // Arrange
      const target = createTestTarget();
      const credentials = new ZLoginBuilder().email(profile.email).build();
      // Act
      const actual = await target.recover(credentials).catch((err) => Promise.resolve(err));
      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe('Activation', () => {
    beforeEach(() => {
      http.set(ZProfileService.createActivationsUrl(), ZHttpMethod.Put, new ZHttpResultBuilder().data(profile).status(ZHttpCodeSuccess.OK).build());
    });

    it('should activate the users account.', async () => {
      // Arrange
      const target = createTestTarget();
      const activator = new ZProfileActivationBuilder().email('gambit@marvel.com').key(v4()).build();
      // Act
      const actual = await target.activate(activator);
      // Assert
      expect(actual).toEqual(profile);
    });
  });

  describe('Deactivation', () => {
    beforeEach(() => {
      http.set(ZProfileService.createActivationsUrl(), ZHttpMethod.Delete, new ZHttpResultBuilder().data(profile).status(ZHttpCodeSuccess.OK).build());
    });

    it('should deactivate the users account.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.deactivate();
      // Assert
      expect(actual).toEqual(profile);
    });
  });

  describe('Reactivation', () => {
    beforeEach(() => {
      http.set(ZProfileService.createActivationsUrl(), ZHttpMethod.Post, new ZHttpResultBuilder().data(profile).status(ZHttpCodeSuccess.OK).build());
    });

    it('should reactivate the users account.', async () => {
      // Arrange
      const target = createTestTarget();
      const activator = new ZProfileActivationBuilder().email('gambit@marvel.com').key(v4()).build();
      // Act
      const actual = await target.reactivate(activator);
      // Assert
      expect(actual).toEqual(profile);
    });
  });
});
