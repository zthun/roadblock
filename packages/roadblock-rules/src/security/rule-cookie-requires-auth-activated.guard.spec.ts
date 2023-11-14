import { ZUserBuilder } from '@zthun/works.core';
import { v4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZRuleCookieRequiresAuthActivated } from './rule-cookie-requires-auth-activated.guard';
import { ZSecurityService } from './security.service';

describe('ZRuleCookieRequestAuthAny', () => {
  function createTestTarget() {
    return new ZRuleCookieRequiresAuthActivated(mock<ZSecurityService>());
  }

  it('does nothing if all rules pass', () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().active().build())).not.toThrow();
  });

  it('throws a ForbiddenException if the user is not activated.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().inactive(v4()).build())).toThrow();
  });

  it('throws a ForbiddenException if the user is falsy.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(null)).toThrow();
  });
});
