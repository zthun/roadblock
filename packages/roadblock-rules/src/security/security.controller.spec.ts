import { ZHttpCodeSuccess } from '@zthun/webigail-http';
import { IZProfile, ZProfileBuilder, ZUserBuilder } from '@zthun/works.core';
import { Request, Response } from 'express';
import { Mocked, beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZSecurityController } from './security.controller';
import { ZSecurityService } from './security.service';

describe('ZSecurityController', () => {
  let gambit: IZProfile;
  let jwt: Mocked<ZSecurityService>;
  let req: Mocked<Request>;
  let res: Mocked<Response>;

  function createTestTarget() {
    return new ZSecurityController(jwt);
  }

  beforeEach(() => {
    gambit = new ZProfileBuilder().email('gambit@marvel.com').active().build();

    req = mock<Request>();
    res = mock<Response>();
    res.status.mockReturnValue(res);
    res.send.mockReturnValue(res);

    jwt = mock<ZSecurityService>();
    jwt.extract.mockResolvedValue(new ZUserBuilder().email('gambit@marvel.com').super().active().build());
  });

  describe('Identity', () => {
    it('returns the individual profile from the token.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.read(req, res);
      // Assert
      expect(actual).toEqual(gambit);
    });

    it('sets the response to a no content status if no user exists.', async () => {
      // Arrange
      jwt.extract.mockResolvedValue(null);
      const target = createTestTarget();
      // Act
      await target.read(req, res);
      // Assert
      expect(res.status).toHaveBeenCalledWith(ZHttpCodeSuccess.NoContent);
    });

    it('returns null if no such user exists.', async () => {
      // Arrange
      jwt.extract.mockResolvedValue(null);
      const target = createTestTarget();
      // Act
      const actual = await target.read(req, res);
      // Assert
      expect(actual).toBeNull();
    });
  });
});
