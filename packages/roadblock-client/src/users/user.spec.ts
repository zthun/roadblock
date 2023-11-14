import { v4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { ZUserBuilder } from './user';

describe('ZUserBuilder', () => {
  function createTestTarget() {
    return new ZUserBuilder();
  }

  describe('Properties', () => {
    it('sets the id.', () => {
      const expected = v4();
      expect(createTestTarget().id(expected).build()._id).toEqual(expected);
    });

    it('sets the email.', () => {
      const expected = 'gambit@marvel.com';
      expect(createTestTarget().email(expected).build().email).toEqual(expected);
    });

    it('sets the display.', () => {
      const expected = 'Gambit';
      expect(createTestTarget().display(expected).build().display).toEqual(expected);
    });

    it('sets the password.', () => {
      const expected = 'bad-password';
      expect(createTestTarget().password(expected).build().password).toEqual(expected);
    });

    it('sets the user inactive.', () => {
      const expected = v4();
      expect(createTestTarget().inactive(expected).build().activator?.key).toEqual(expected);
    });

    it('sets the user inactive activator expiration.', () => {
      const time = 2400;
      const expected = new Date().getTime() + time;
      const actual = createTestTarget().inactive(v4(), time).build();
      expect(actual.activator?.exp).toBeGreaterThanOrEqual(expected);
    });

    it('sets the user active', () => {
      expect(createTestTarget().inactive(v4()).active().build().activator).toBeNull();
    });

    it('sets the user recovery.', () => {
      const expected = v4();
      expect(createTestTarget().recover(expected).build().recovery?.password).toEqual(expected);
    });

    it('sets the user recovery exp.', () => {
      const time = 2400;
      const expected = new Date().getTime() + time;
      expect(createTestTarget().recover(v4(), time).build().recovery?.exp).toBeGreaterThanOrEqual(expected);
    });

    it('sets the the user recovery password to null on login.', () => {
      expect(createTestTarget().recover(v4()).login().build().recovery).toBeNull();
    });

    it('sets a timestamp of the last user login.', () => {
      expect(createTestTarget().recover(v4()).login().build().login).toBeTruthy();
    });

    it('sets the super flag.', () => {
      expect(createTestTarget().super().build().super).toBeTruthy();
    });

    it('sets the avatar.', () => {
      const expected = 'image-data';
      expect(createTestTarget().avatar(expected).build().avatar).toEqual(expected);
    });
  });

  describe('Copy', () => {
    it('copies another user.', () => {
      const expected = createTestTarget()
        .email(v4())
        .password(v4())
        .id(v4())
        .inactive('some-activator-password')
        .recover('some-recovery-password', 1000)
        .build();
      const actual = createTestTarget().copy(expected).build();
      expect(actual).toEqual(expected);
    });
  });
});
