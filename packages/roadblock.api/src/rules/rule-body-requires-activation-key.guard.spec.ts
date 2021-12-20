/* eslint-disable require-jsdoc */
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { IZProfileActivation, IZUser, ZProfileActivationBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { Request } from 'express';
import { v4 } from 'uuid';
import { ZSecurityService } from '../../security/security.service';
import { ZRuleBodyRequiresActivationKey } from './rule-body-requires-activation-key.guard';

describe('ZRuleBodyRequiresActivationKey', () => {
  let security: jest.Mocked<ZSecurityService>;
  let user: IZUser;
  let activation: IZProfileActivation;
  let req: jest.Mocked<Request>;
  let host: jest.Mocked<HttpArgumentsHost>;
  let context: jest.Mocked<ExecutionContext>;

  function createTestTarget() {
    return new ZRuleBodyRequiresActivationKey(security);
  }

  beforeEach(() => {
    user = new ZUserBuilder().email('gambit@marvel.com').inactive(v4()).password('not-secure').build();
    activation = new ZProfileActivationBuilder().email(user.email).key(user.activator.key).build();

    req = createMocked(['get']);
    req.body = activation;

    host = createMocked(['getRequest']);
    host.getRequest.mockReturnValue(req);

    context = createMocked(['switchToHttp']);
    context.switchToHttp.mockReturnValue(host);

    security = createMocked(['extract']);
    security.extract.mockResolvedValue(Promise.resolve(user));
  });

  it('return true if all rules pass.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.canActivate(context);
    // Assert
    expect(actual).toBeTruthy();
  });

  it('throws a Forbidden exception if the activator keys do not match.', async () => {
    // Arrange
    const target = createTestTarget();
    user = new ZUserBuilder().copy(user).inactive(v4()).build();
    security.extract.mockResolvedValue(Promise.resolve(user));
    // Act
    const actual = target.canActivate(context);
    // Assert
    await expect(actual).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws a Forbidden exception if the activator key has expired.', async () => {
    // Arrange
    const target = createTestTarget();
    user = new ZUserBuilder().copy(user).inactive(user.activator.key, 0).build();
    security.extract.mockResolvedValue(Promise.resolve(user));
    // Act
    const actual = target.canActivate(context);
    // Assert
    await expect(actual).rejects.toBeInstanceOf(ForbiddenException);
  });
});
