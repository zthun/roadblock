import { v4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { ZProfileActivationBuilder } from './profile-activation';

describe('ZProfileActivationBuilder', () => {
  function createTestTarget() {
    return new ZProfileActivationBuilder();
  }

  describe('Properties', () => {
    it('sets the email.', () => {
      const expected = 'gambit@marvel.com';
      expect(createTestTarget().email(expected).build().email).toEqual(expected);
    });

    it('sets the key.', () => {
      const expected = v4();
      expect(createTestTarget().key(expected).build().key).toEqual(expected);
    });
  });

  describe('Copy', () => {
    it('copies another profile activation.', () => {
      const expected = createTestTarget().email('gambit@marvel.com').key(v4()).build();
      const actual = createTestTarget().copy(expected).build();
      expect(actual).toEqual(expected);
    });
  });

  describe('Assign', () => {
    it('assigns properties from another activation.', () => {
      const key = v4();
      const email = 'x@marvel.com';
      const expected = createTestTarget().email('x@marvel.com').key(key).build();
      const actual = createTestTarget().email('gambit@marvel.com').key(key).assign({ email }).build();
      expect(actual).toEqual(expected);
    });
  });
});
