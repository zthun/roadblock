import { ClientProxy } from '@nestjs/microservices';
import { ZLoginBuilder, ZProfileBuilder, ZUserBuilder } from '@zthun/works.core';
import { of } from 'rxjs';
import { v4 } from 'uuid';
import { Mocked, beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZUsersClient } from './users.client';

describe('UsersClient', () => {
  let proxy: Mocked<ClientProxy>;

  function createTestTarget() {
    return new ZUsersClient(proxy);
  }

  beforeEach(() => {
    proxy = mock<ClientProxy>();
    proxy.send.mockReturnValue(of(null));
  });

  describe('Find', () => {
    it('finds by id.', async () => {
      // Arrange.
      const _id = v4();
      const target = createTestTarget();
      // Act.
      await target.findById(_id);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'find' }, { _id });
    });

    it('finds by email.', async () => {
      // Arrange.
      const email = 'gambit@marvel.com';
      const target = createTestTarget();
      // Act.
      await target.findByEmail(email);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'find' }, { email });
    });
  });

  describe('Create', () => {
    it('creates a user.', async () => {
      // Arrange.
      const login = new ZLoginBuilder().email('test@email.com').password('bad-password').build();
      const target = createTestTarget();
      // Act.
      await target.create(login);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'create' }, { login });
    });
  });

  describe('Update', () => {
    it('should update a profile.', async () => {
      // Arrange.
      const id = v4();
      const profile = new ZProfileBuilder().email('test@email.com').build();
      const target = createTestTarget();
      // Act.
      await target.update(id, profile);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'update' }, { id, profile });
    });
  });

  describe('Delete', () => {
    it('should delete a profile.', async () => {
      // Arrange.
      const id = v4();
      const target = createTestTarget();
      // Act.
      await target.remove(id);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'remove' }, { id });
    });
  });

  describe('Login', () => {
    it('timestamps the user login.', async () => {
      // Arrange.
      const id = v4();
      const target = createTestTarget();
      // Act.
      await target.login(id);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'login' }, { id });
    });

    it('recovers a lost password.', async () => {
      // Arrange.
      const email = 'gambit@marvel.com';
      const target = createTestTarget();
      // Act.
      await target.recover(email);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'recover' }, { email });
    });

    it('checks the user/password combination.', async () => {
      // Arrange.
      const credentials = new ZLoginBuilder().email('test@email.com').password('bad-password').build();
      const target = createTestTarget();
      // Act.
      await target.compare(credentials);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'compare' }, { credentials });
    });
  });

  describe('Activation', () => {
    it('should activate a user.', async () => {
      // Arrange.
      const user = new ZUserBuilder().email('test@email.com').build();
      const target = createTestTarget();
      // Act.
      await target.activate(user);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'activate' }, { user });
    });

    it('should deactivate a profile.', async () => {
      // Arrange.
      const user = new ZUserBuilder().email('test@email.com').build();
      const target = createTestTarget();
      // Act.
      await target.deactivate(user);
      // Assert.
      expect(proxy.send).toHaveBeenCalledWith({ cmd: 'deactivate' }, { user });
    });
  });
});
