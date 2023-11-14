import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ZUserBuilder } from '@zthun/works.core';
import { Request } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZRuleCookieRequiresAuth } from './rule-cookie-requires-auth.guard';
import { ZSecurityService } from './security.service';

describe('ZRuleCookieRequestAuth', () => {
  it('return true if all rules pass.', async () => {
    // Arrange
    const user = new ZUserBuilder().email('cable@marvel.com').password('pa$$word1').build();
    const jwt = mock<ZSecurityService>();
    jwt.extract.mockResolvedValue(user);
    const target = new (class extends ZRuleCookieRequiresAuth {
      public claim = vi.fn();
    })(jwt);
    const req = mock<Request>();
    const host = mock<HttpArgumentsHost>();
    host.getRequest.mockReturnValue(req);
    const context = mock<ExecutionContext>();
    context.switchToHttp.mockReturnValue(host);
    // Act
    const actual = await target.canActivate(context);
    // Assert
    expect(actual).toBeTruthy();
  });
});
