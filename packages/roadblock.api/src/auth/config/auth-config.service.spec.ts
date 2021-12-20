/* eslint-disable require-jsdoc */
import { ZConfigEntryBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { ZVaultClient } from '@zthun/works.microservices';
import { v4 } from 'uuid';
import { ZAuthConfigService } from './auth-config.service';

describe('ZAuthConfigService', () => {
  let vault: jest.Mocked<ZVaultClient>;

  async function createTestTarget() {
    const target = new ZAuthConfigService(vault);
    await target.onModuleInit();
    return target;
  }

  beforeEach(() => {
    vault = createMocked(['get']);
  });

  describe('JWT', () => {
    it('initializes the JWT secret.', async () => {
      // Arrange
      const expected = new ZConfigEntryBuilder().scope(ZAuthConfigService.SCOPE).key(ZAuthConfigService.KEY_JWT).value(expect.anything()).build();
      vault.get.mockImplementationOnce((entry) => Promise.resolve(entry));
      // Act
      await createTestTarget();
      // Assert
      expect(vault.get).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('returns the jwt secret.', async () => {
      // Arrange
      const expected = new ZConfigEntryBuilder().scope(ZAuthConfigService.SCOPE).key(ZAuthConfigService.KEY_JWT).value(v4()).build();
      vault.get.mockImplementation(() => Promise.resolve(expected));
      const target = await createTestTarget();
      // Act
      const actual = await target.jwt();
      // Assert
      expect(actual.value).toEqual(expected.value);
    });
  });
});
