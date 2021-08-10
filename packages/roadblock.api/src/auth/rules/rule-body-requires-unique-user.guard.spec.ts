/* eslint-disable require-jsdoc */
import { ConflictException } from '@nestjs/common';
import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { IZLogin, ZLoginBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { Request } from 'express';
import { ZUsersService } from '../../users/users.service';
import { ZRuleBodyRequiresUniqueUser } from './rule-body-requires-unique-user.guard';

describe('ZRuleBodyRequiresUniqueUser', () => {
  let users: jest.Mocked<ZUsersService>;
  let login: IZLogin;
  let req: jest.Mocked<Request>;
  let host: jest.Mocked<HttpArgumentsHost>;
  let context: jest.Mocked<ExecutionContext>;

  function createTestTarget() {
    return new ZRuleBodyRequiresUniqueUser(users);
  }

  beforeEach(() => {
    login = new ZLoginBuilder().email('gambit@marvel.com').password('weak').autoConfirm().build();

    req = createMocked(['get']);
    req.body = login;

    host = createMocked(['getRequest']);
    host.getRequest.mockReturnValue(req);

    context = createMocked(['switchToHttp']);
    context.switchToHttp.mockReturnValue(host);

    users = createMocked(['findByEmail']);
    users.findByEmail.mockResolvedValue(null);
  });

  it('return true if all rules pass.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.canActivate(context);
    // Assert
    expect(actual).toBeTruthy();
  });

  it('throws a ConflictException if the user is not unique.', async () => {
    // Arrange
    const target = createTestTarget();
    users.findByEmail.mockResolvedValue(new ZUserBuilder().build());
    // Act
    const actual = target.canActivate(context);
    // Assert
    await expect(actual).rejects.toBeInstanceOf(ConflictException);
  });
});
