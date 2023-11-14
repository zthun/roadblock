import { ClientProxy } from '@nestjs/microservices';
import { ZConfigEntryBuilder } from '@zthun/vault-client';
import { ZUserBuilder } from '@zthun/works.core';
import { of } from 'rxjs';
import { v4 } from 'uuid';
import { Mocked, beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZCookiesClient } from './cookies.client';

describe('ZCookiesClient', () => {
  let proxy: Mocked<ClientProxy>;

  function createTestTarget() {
    return new ZCookiesClient(proxy);
  }

  beforeEach(() => {
    proxy = mock<ClientProxy>();
    proxy.send.mockReturnValue(of(null));
  });

  it('creates the authentication cookie.', async () => {
    // Arrange.
    const user = new ZUserBuilder().id(v4()).build();
    const secret = new ZConfigEntryBuilder(null).generate().build().value as string;
    const domain = 'zthunworks.com';
    const target = createTestTarget();
    // Act.
    await target.createAuthentication(user, secret, domain);
    // Assert.
    expect(proxy.send).toHaveBeenCalledWith({ cmd: 'createAuthentication' }, { user, secret, domain });
  });

  it('decodes the jwt secret.', async () => {
    // Arrange.
    const jwt = v4();
    const secret = new ZConfigEntryBuilder(null).generate().build().value as string;
    const target = createTestTarget();
    // Act.
    await target.whoIs(jwt, secret);
    // Assert.
    expect(proxy.send).toHaveBeenCalledWith({ cmd: 'whoIs' }, { jwt, secret });
  });
});
