/* eslint-disable require-jsdoc */
import { IZDatabase, ZDatabaseMemory, ZDatabaseOptionsBuilder } from '@zthun/works.dal';
import { IZLogin, IZProfile, IZUser, ZLoginBuilder, ZUserBuilder } from '@zthun/works.core';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { ZUsersCollections } from './users.collections';
import { ZUsersService } from './users.service';

describe('ZUsersService', () => {
  let mongo: ZDatabaseMemory;
  let dal: IZDatabase;
  let userA: IZUser;
  let userB: IZUser;
  let loginA: IZLogin;
  let loginB: IZLogin;

  beforeAll(async () => {
    mongo = await ZDatabaseMemory.connect(new ZDatabaseOptionsBuilder().database('user-controller-test').build());
    await mongo.start();
    dal = mongo;
  });

  afterAll(async () => {
    await mongo.kill();
  });

  beforeEach(async () => {
    loginA = new ZLoginBuilder().email('a@gmail.com').password('super-secret-a').autoConfirm().build();
    loginB = new ZLoginBuilder().email('b@yahoo.com').password('super-secret-b').autoConfirm().build();

    const pwdA = await hash(loginA.password, ZUsersService.BcryptRounds);
    const pwdB = await hash(loginB.password, ZUsersService.BcryptRounds);

    userA = new ZUserBuilder().email(loginA.email).password(pwdA).build();
    userB = new ZUserBuilder().email(loginB.email).password(pwdB).build();
  });

  afterEach(async () => {
    await dal.delete(ZUsersCollections.Users).run();
  });

  function createTestTarget() {
    return new ZUsersService(dal);
  }

  describe('Create', () => {
    beforeEach(async () => {
      [userB] = await dal.create(ZUsersCollections.Users, [userB]).run();
    });

    it('creates a user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const created = await target.create(loginA);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: created._id }).run();
      // Assert
      expect(actual._id).toBeTruthy();
      expect(actual.email).toEqual(loginA.email);
    });

    it('creates the super user if the new user is the first in the system.', async () => {
      // Arrange
      const target = createTestTarget();
      await dal.delete(ZUsersCollections.Users).run();
      // Act
      const created = await target.create(loginA);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: created._id }).run();
      // Assert
      expect(actual.super).toBeTruthy();
    });

    it('always sets the super user to active without having to have them activate their account.', async () => {
      // Arrange
      const target = createTestTarget();
      await dal.delete(ZUsersCollections.Users).run();
      // Act
      const created = await target.create(loginA);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: created._id }).run();
      // Assert
      expect(actual.activator).toBeFalsy();
    });

    it('creates a normal user if there is already a super user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const created = await target.create(loginA);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: created._id }).run();
      // Assert
      expect(actual.super).toBeFalsy();
    });

    it('generates a one time password for the user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const created = await target.create(loginA);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: created._id }).run();
      // Assert
      expect(actual.activator).toBeTruthy();
    });

    it('secures the password.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const created = await target.create(loginA);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: created._id }).run();
      const same = await compare(loginA.password, actual.password);
      // Assert
      expect(same).toBeTruthy();
    });
  });

  describe('Find', () => {
    beforeEach(async () => {
      [userA, userB] = await dal.create(ZUsersCollections.Users, [userA, userB]).run();
    });

    it('finds a user by id.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.findById(userA._id);
      // Assert
      expect(actual).toEqual(userA);
    });

    it('reads a user by email.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.findByEmail(userA.email);
      // Assert
      expect(actual).toEqual(userA);
    });
  });

  describe('Update', () => {
    beforeEach(async () => {
      [userA, userB] = await dal.create<IZUser>(ZUsersCollections.Users, [userA, userB]).run();
    });

    it('updates the user email.', async () => {
      // Arrange
      const target = createTestTarget();
      const expected = 'super-user';
      const profile: IZProfile = { email: expected };
      // Act
      await target.update(userA._id, profile);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(actual.email).toEqual(expected);
    });

    it('deactivates the account if the email changes.', async () => {
      // Arrange
      const target = createTestTarget();
      const profile: IZProfile = { email: 'gambit@marvel.com' };
      // Act
      await target.update(userA._id, profile);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(actual.activator).toBeTruthy();
    });

    it('updates the password.', async () => {
      // Arrange
      const target = createTestTarget();
      const profile: IZProfile = { password: 'super-password', confirm: 'super-password' };
      // Act
      await target.update(userA._id, profile);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      const same = await compare(profile.password, actual.password);
      // Assert
      expect(same).toBeTruthy();
    });

    it('removes the recovery password if the password is properly updated.', async () => {
      // Arrange
      const target = createTestTarget();
      const profile: IZProfile = { password: 'super-password', confirm: 'super-password' };
      // Act
      await target.recover(userA.email);
      await target.update(userA._id, profile);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(actual.recovery).toBeFalsy();
    });

    it('updates the display.', async () => {
      // Arrange
      const target = createTestTarget();
      const expected = 'Superman';
      const profile: IZProfile = { display: expected };
      // Act
      await target.update(userA._id, profile);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(actual.display).toEqual(expected);
    });

    it('updates the avatar.', async () => {
      // Arrange
      const target = createTestTarget();
      const expected = 'https://avatarfiles.alphacoders.com/116/thumb-116912.jpg';
      const profile: IZProfile = { avatar: expected };
      // Act
      await target.update(userA._id, profile);
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(actual.avatar).toEqual(expected);
    });

    it('does not update anything if nothing is set.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.update(userA._id, {});
      const [actual] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(actual.password).toEqual(userA.password);
    });

    it('activates the user.', async () => {
      // Arrange
      let userC = new ZUserBuilder().email('c@gmail.com').password('whatever').inactive(v4()).build();
      [userC] = await dal.create<IZUser>(ZUsersCollections.Users, [userC]).run();
      const target = createTestTarget();
      // Act
      const actual = await target.activate(userC);
      // Assert
      expect(actual.activator).toBeFalsy();
    });

    it('deactivates the user.', async () => {
      // Arrange
      const target = createTestTarget();
      await target.activate(userA);
      // Act
      const actual = await target.deactivate(userA);
      // Assert
      expect(actual.activator).toBeTruthy();
    });
  });

  describe('Delete', () => {
    beforeEach(async () => {
      [userA, userB] = await dal.create(ZUsersCollections.Users, [userA, userB]).run();
    });

    it('deletes the user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.remove(userA._id);
      const blobs = await dal.read(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      // Assert
      expect(blobs.length).toEqual(0);
    });
  });

  describe('Authenticate', () => {
    beforeEach(async () => {
      [userA] = await dal.create(ZUsersCollections.Users, [userA]).run();
    });

    it('returns false if no such user exists.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.compare(loginB);
      // Assert
      expect(actual).toBeFalsy();
    });

    it('returns false if the passwords do not match.', async () => {
      // Arrange
      const target = createTestTarget();
      loginA.password = 'wrong-password';
      // Act
      const actual = await target.compare(loginA);
      // Assert
      expect(actual).toBeFalsy();
    });

    it('returns true if the email and password match.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.compare(loginA);
      // Assert
      expect(actual).toBeTruthy();
    });

    it('returns true if the email and recovery password match.', async () => {
      // Arrange
      const target = createTestTarget();
      const pwd = await target.recover(userA.email);
      const login = new ZLoginBuilder().copy(loginA).password(pwd).build();
      // Act
      const actual = await target.compare(login);
      // Assert
      expect(actual).toBeTruthy();
    });

    it('returns false if the email and recovery password match, but the recovery password has expired.', async () => {
      // Arrange
      const target = createTestTarget();
      const pwd = await target.recover(userA.email);
      userA = await target.findById(userA._id);
      userA.recovery.exp = new Date().getTime();
      await dal.update(ZUsersCollections.Users, userA).filter({ _id: userA._id }).run();
      const login = new ZLoginBuilder().copy(loginA).password(pwd).build();
      // Act
      const actual = await target.compare(login);
      // Assert
      expect(actual).toBeFalsy();
    });

    it('returns false if the email and password do not match and the recovery password does not match.', async () => {
      // Arrange
      const target = createTestTarget();
      await target.recover(userA.email);
      loginA.password = 'wrong-password';
      // Act
      const actual = await target.compare(loginA);
      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('Recover', () => {
    beforeEach(async () => {
      [userA] = await dal.create(ZUsersCollections.Users, [userA]).run();
    });

    it('returns null if the user email does not exist.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.recover(userB.email);
      // Assert
      expect(actual).toBeFalsy();
    });

    it('returns a generated password if the email does exist.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.recover(userA.email);
      // Assert
      expect(actual).toBeTruthy();
    });

    it('generates a recovery key for the user that matches the generated password.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const generated = await target.recover(userA.email);
      const [user] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      const actual = await compare(generated, user.recovery.password);
      // Assert
      expect(actual).toBeTruthy();
    });

    it('removes the recovery password when the user remembers it or logs in with the recovery password.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.recover(userA.email);
      await target.login(userA._id);
      const [user] = await dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: userA._id }).run();
      const actual = user.recovery;
      // Assert
      expect(actual).toBeFalsy();
    });
  });
});
