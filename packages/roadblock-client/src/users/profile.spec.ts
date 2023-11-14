import { v4 } from 'uuid';
import { beforeEach, describe, expect, it } from 'vitest';
import { IZUser, ZUserBuilder } from '../users/user';
import { ZProfileBuilder } from './profile';

describe('ZProfileBuilder', () => {
  function createTestTarget() {
    return new ZProfileBuilder();
  }

  describe('Properties', () => {
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

    it('sets the confirmation.', () => {
      const expected = 'bad-password';
      expect(createTestTarget().confirm(expected).build().confirm).toEqual(expected);
    });

    it('auto confirms to the new password.', () => {
      const expected = 'bad-password';
      expect(createTestTarget().password(expected).autoConfirm().build().confirm).toEqual(expected);
    });

    it('marks the profile as active.', () => {
      expect(createTestTarget().active().build().active).toBeTruthy();
    });

    it('sets the avatar.', () => {
      const expected = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
      expect(createTestTarget().avatar(expected).build().avatar).toEqual(expected);
    });
  });

  describe('From user', () => {
    let gambit: IZUser;

    beforeEach(() => {
      gambit = new ZUserBuilder()
        .email('gambit@marvel.com')
        .password('not-a-great-password')
        .display('Gambit')
        .avatar('https://steamavatar.io/img/14777429602y3IT.jpg')
        .active()
        .super()
        .build();
    });

    it('copies the email.', () => {
      expect(createTestTarget().user(gambit).build().email).toEqual(gambit.email);
    });

    it('copies the display.', () => {
      expect(createTestTarget().user(gambit).build().display).toEqual(gambit.display);
    });

    it('copies the avatar.', () => {
      expect(createTestTarget().user(gambit).build().avatar).toEqual(gambit.avatar);
    });

    it('does not copy the password.', () => {
      const profile = createTestTarget().user(gambit).build();
      const actual = profile.password || profile.confirm;
      expect(actual).toBeUndefined();
    });

    it('marks the profile as active if there is no activator code.', () => {
      expect(createTestTarget().user(gambit).build().active).toBeTruthy();
    });

    it('marks the profile as inactive if there is an activator code.', () => {
      gambit = new ZUserBuilder().copy(gambit).inactive(v4()).build();
      expect(createTestTarget().user(gambit).build().active).toBeFalsy();
    });
  });

  describe('Copy and Assignment', () => {
    it('copies another profile.', () => {
      const expected = new ZProfileBuilder()
        .email('gambit@marvel.com')
        .display('Gambit')
        .avatar('https://steamavatar.io/img/14777429602y3IT.jpg')
        .build();
      const actual = createTestTarget().copy(expected).build();
      expect(actual).toEqual(expected);
    });

    it('assigns another profile.', () => {
      const email = 'gambit@marvel.com';
      const display = 'Gambit';
      const expected = new ZProfileBuilder().email(email).display(display).build();
      const actual = createTestTarget().display(display).assign({ email }).build();
      expect(actual).toEqual(expected);
    });
  });
});
