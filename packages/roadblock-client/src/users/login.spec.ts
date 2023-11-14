import { v4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { IZLogin, ZLoginBuilder } from './login';

describe('ZLoginBuilder', () => {
  function createTestTarget() {
    return new ZLoginBuilder();
  }

  describe('Copy', () => {
    it('creates a copy', () => {
      // Arrange
      const other = new ZLoginBuilder().email(v4()).password(v4()).autoConfirm().build();
      const target = createTestTarget();
      // Act
      const actual = target.copy(other).build();
      // Assert
      expect(actual).not.toBe(other);
      expect(actual).toEqual(other);
    });
  });

  describe('Properties', () => {
    function assertPropertySet<T>(
      expected: T,
      buildFn: (target: ZLoginBuilder) => ZLoginBuilder,
      actualFn: (user: IZLogin) => T
    ) {
      // Arrange
      const target = createTestTarget();
      // Act
      const login = buildFn(target).build();
      const actual = actualFn(login);
      // Assert
      expect(actual).toEqual(expected);
    }

    it('sets the email.', () => {
      const email = v4();
      assertPropertySet(
        email,
        (t) => t.email(email),
        (u) => u.email
      );
    });

    it('sets the password.', () => {
      const pwd = v4();
      assertPropertySet(
        pwd,
        (t) => t.password(pwd),
        (u) => u.password
      );
    });

    it('sets the confirm.', () => {
      const confirm = v4();
      assertPropertySet(
        confirm,
        (t) => t.confirm(confirm),
        (u) => u.confirm
      );
    });
  });

  describe('Confirmation', () => {
    it('auto sets the confirm to the password.', () => {
      // Arrange
      const target = createTestTarget().password('foo');
      // Act
      const actual = target.autoConfirm().build();
      // Assert
      expect(actual.confirm).toEqual(actual.password);
    });
  });
});
