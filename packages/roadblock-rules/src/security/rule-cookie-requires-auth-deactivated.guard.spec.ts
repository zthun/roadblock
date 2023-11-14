import { ConflictException } from '@nestjs/common';
import { ZUserBuilder } from '@zthun/works.core';
import { v4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZRuleCookieRequiresAuthDeactivated } from './rule-cookie-requires-auth-deactivated.guard';
import { ZSecurityService } from './security.service';

describe('ZRuleCookieRequestAuthAny', () => {
  function createTestTarget() {
    return new ZRuleCookieRequiresAuthDeactivated(mock<ZSecurityService>());
  }

  it('does nothing if all rules pass', () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().inactive(v4()).build())).not.toThrow();
  });

  it('throws a ConflictException if the user is not activated.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().active().build())).toThrow(ConflictException);
  });

  it('throws a ConflictException if the user is falsy.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(null)).toThrow(ConflictException);
  });
});
