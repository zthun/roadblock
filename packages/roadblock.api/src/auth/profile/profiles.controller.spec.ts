/* eslint-disable require-jsdoc */
import { IZProfile, ZLoginBuilder, ZProfileActivationBuilder, ZProfileBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ZTokensService } from '../tokens/tokens.service';
import { ZProfileActivationCreateDto } from './profile-activation-create.dto';
import { ZProfileActivationUpdateDto } from './profile-activation-update.dto';
import { ZProfileCreateDto } from './profile-create.dto';
import { ZProfileRecoveryCreateDto } from './profile-recovery-create.dto';
import { ZProfilesController } from './profiles.controller';
import { ZProfilesService } from './profiles.service';

describe('ZProfilesController', () => {
  let gambit: IZProfile;
  let jwt: jest.Mocked<ZTokensService>;
  let profile: jest.Mocked<ZProfilesService>;
  let req: jest.Mocked<Request>;
  let res: jest.Mocked<Response>;

  function createTestTarget() {
    return new ZProfilesController(jwt, profile);
  }

  beforeEach(() => {
    gambit = new ZProfileBuilder().email('gambit@marvel.com').active().build();

    req = createMocked<Request>();
    res = createMocked<Response>(['sendStatus', 'send']);

    profile = createMocked<ZProfilesService>(['update', 'create', 'remove', 'activate', 'deactivate', 'reactivate', 'recoverPassword']);
    profile.update.mockResolvedValue(gambit);
    profile.remove.mockResolvedValue(gambit);
    profile.create.mockResolvedValue(gambit);
    profile.activate.mockResolvedValue(gambit);
    profile.deactivate.mockResolvedValue(gambit);
    profile.reactivate.mockResolvedValue(gambit);

    jwt = createMocked<ZTokensService>(['extract']);
    jwt.extract.mockReturnValue(Promise.resolve(new ZUserBuilder().email('gambit@marvel.com').super().active().build()));
  });

  describe('CRUD', () => {
    it('returns the individual profile from the token.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.read(req);
      // Assert
      expect(actual).toEqual(gambit);
    });

    it('returns the updated profile.', async () => {
      // Arrange
      const target = createTestTarget();
      const login = new ZLoginBuilder().email(gambit.email).password(gambit.password).autoConfirm().build();
      // Act
      const actual = await target.update(req, login);
      // Assert
      expect(actual).toEqual(gambit);
    });

    it('returns the created profile.', async () => {
      // Arrange
      const target = createTestTarget();
      const login = new ZLoginBuilder().email(gambit.email).password(gambit.password).autoConfirm().build();
      const dto = plainToClass(ZProfileCreateDto, login);
      // Act
      const actual = await target.create(dto);
      // Assert
      expect(actual).toEqual(gambit);
    });

    it('returns the removed profile.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.remove(req);
      // Assert
      expect(actual).toEqual(gambit);
    });
  });

  describe('Activation', () => {
    it('activates user.', async () => {
      // Arrange
      const target = createTestTarget();
      const activate = new ZProfileActivationBuilder().email(gambit.email).key(v4()).build();
      const dto = plainToClass(ZProfileActivationUpdateDto, activate);
      // Act
      await target.updateActivation(dto);
      // Assert
      expect(profile.activate).toHaveBeenCalledWith(gambit.email);
    });

    it('reactivates user.', async () => {
      // Arrange
      const target = createTestTarget();
      const activate = new ZProfileActivationBuilder().email(gambit.email).key(null).build();
      const dto = plainToClass(ZProfileActivationCreateDto, activate);
      // Act
      await target.createActivation(dto);
      // Assert
      expect(profile.reactivate).toHaveBeenCalledWith(gambit.email);
    });

    it('deactivates user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.deleteActivation(req);
      // Assert
      expect(profile.deactivate).toHaveBeenCalledWith(gambit.email);
    });
  });

  describe('Recovery', () => {
    it('returns a 204 (no content).', async () => {
      // Arrange
      const target = createTestTarget();
      const dto = plainToClass(ZProfileRecoveryCreateDto, gambit);
      // Act
      await target.createPasswordRecovery(dto, res);
      // Assert
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('creates the users recovery password.', async () => {
      // Arrange
      const target = createTestTarget();
      const dto = plainToClass(ZProfileRecoveryCreateDto, gambit);
      // Act
      await target.createPasswordRecovery(dto, res);
      // Assert
      expect(profile.recoverPassword).toHaveBeenCalledWith(dto.email);
    });
  });
});
