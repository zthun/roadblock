import { ZUserBuilder } from '@zthun/works.core';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZRuleCookieRequiresAuthAny } from './rule-cookie-requires-auth-any.guard';
import { ZSecurityService } from './security.service';

describe('ZRuleCookieRequestAuthAny', () => {
  function createTestTarget() {
    return new ZRuleCookieRequiresAuthAny(mock<ZSecurityService>());
  }

  it('does nothing if all rules pass', () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().build())).not.toThrow();
  });

  it('throws an UnauthorizedException if the user is not found.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(null)).toThrow();
  });
});
