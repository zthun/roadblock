import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { Request } from 'express';
import { ZTokensService } from '../tokens/tokens.service';
import { ZRuleCookieRequiresAuth } from './rule-cookie-requires-auth.guard';

describe('ZRuleCookieRequestAuth', () => {
  it('return true if all rules pass.', async () => {
    // Arrange
    const user = new ZUserBuilder().email('cable@marvel.com').password('pa$$word1').build();
    const jwt = createMocked<ZTokensService>(['extract']);
    jwt.extract.mockResolvedValue(user);
    const target = new (class extends ZRuleCookieRequiresAuth {
      public claim = jest.fn();
    })(jwt);
    const req = createMocked<Request>(['get']);
    const host = createMocked<HttpArgumentsHost>(['getRequest']);
    host.getRequest.mockReturnValue(req);
    const context = createMocked<ExecutionContext>(['switchToHttp']);
    context.switchToHttp.mockReturnValue(host);
    // Act
    const actual = await target.canActivate(context);
    // Assert
    expect(actual).toBeTruthy();
  });
});
