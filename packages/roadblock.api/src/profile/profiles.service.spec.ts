/* eslint-disable require-jsdoc */
import { IZConfigEntry, IZEmail, IZLogin, IZProfile, IZServer, IZUser, ZConfigEntryBuilder, ZLoginBuilder, ZProfileBuilder, ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { ZNotificationsClient, ZUsersClient } from '@zthun/works.microservices';
import { v4 } from 'uuid';
import { ZWorksConfigService } from '../../config/works-config.service';
import { ZProfilesService } from './profiles.service';

describe('ZProfilesService', () => {
  let smtp: IZConfigEntry<IZServer>;
  let notifier: IZConfigEntry<string>;
  let domain: IZConfigEntry<string>;

  let users: jest.Mocked<ZUsersClient>;
  let email: jest.Mocked<ZNotificationsClient>;
  let config: jest.Mocked<ZWorksConfigService>;

  function createTestTarget() {
    return new ZProfilesService(users, email, config);
  }

  beforeEach(() => {
    smtp = new ZConfigEntryBuilder().scope(ZWorksConfigService.SCOPE_NOTIFICATIONS).key(ZWorksConfigService.KEY_NOTIFICATIONS_SMTP).value(ZWorksConfigService.VALUE_NOTIFICATIONS_SMTP).build();
    notifier = new ZConfigEntryBuilder().scope(ZWorksConfigService.SCOPE_NOTIFICATIONS).key(ZWorksConfigService.KEY_NOTIFICATIONS_NOTIFIER).value(ZWorksConfigService.VALUE_NOTIFICATIONS_NOTIFIER).build();
    domain = new ZConfigEntryBuilder().scope(ZWorksConfigService.SCOPE_COMMON).key(ZWorksConfigService.KEY_COMMON_DOMAIN).value(ZWorksConfigService.VALUE_COMMON_DOMAIN).build();

    users = createMocked<ZUsersClient>(['create', 'update', 'remove', 'activate', 'deactivate', 'recover', 'findByEmail']);

    email = createMocked<ZNotificationsClient>(['sendEmail']);
    email.sendEmail.mockReturnValue(Promise.resolve(null));

    config = createMocked<ZWorksConfigService>(['domain', 'smtp', 'notifier']);
    config.domain.mockResolvedValue(domain);
    config.smtp.mockResolvedValue(smtp);
    config.notifier.mockResolvedValue(notifier);
  });

  describe('Create', () => {
    let login: IZLogin;

    beforeEach(() => {
      login = new ZLoginBuilder().email('gambit@marvel.com').password('not-secure').build();
      users.create.mockImplementation((log) => Promise.resolve(new ZUserBuilder().email(log.email).password(log.password).inactive(v4()).build()));
    });

    it('creates a new user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.create(login);
      // Assert
      expect(actual.email).toEqual(login.email);
    });

    it('sends the activation email.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.create(login);
      // Assert
      expect(email.sendEmail).toHaveBeenCalledWith(expect.anything(), smtp.value);
    });

    it('does not send the activation email for the super user.', async () => {
      // Arrange
      users.create.mockClear();
      users.create.mockImplementation((log) => Promise.resolve(new ZUserBuilder().email(log.email).password(log.password).active().super().build()));
      const target = createTestTarget();
      // Act
      await target.create(login);
      // Assert
      expect(email.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    let profile: IZProfile;
    let current: IZUser;

    beforeEach(() => {
      current = new ZUserBuilder().id(v4()).email('gambit@marvel.com').active().password('not-very-secure').build();
      profile = new ZProfileBuilder().display('Gambit').build();

      users.update.mockImplementation((id, prof) => Promise.resolve(new ZUserBuilder().id(id).email(current.email).display(prof.display).active().password(current.password).build()));
    });

    it('updates the specified user with the given profile.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.update(current, profile);
      // Assert
      expect(users.update).toHaveBeenCalledWith(current._id, profile);
    });

    it('sends the activation email if the user is deactivated.', async () => {
      // Arrange
      users.update.mockImplementation((id, prof) => Promise.resolve(new ZUserBuilder().id(id).email(current.email).display(prof.display).inactive(v4()).password(current.password).build()));
      const target = createTestTarget();
      // Act
      await target.update(current, profile);
      // Assert
      expect(email.sendEmail).toHaveBeenCalledWith(expect.anything(), smtp.value);
    });
  });

  describe('Remove', () => {
    let current: IZUser;

    beforeEach(() => {
      current = new ZUserBuilder().id(v4()).email('gambit@marvel.com').display('Gambit').active().password('not-very-secure').build();
      users.remove.mockImplementation(() => Promise.resolve(current));
    });

    it('removes the specified user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.remove(current);
      // Assert
      expect(users.remove).toHaveBeenCalledWith(current._id);
    });
  });

  describe('Activate', () => {
    let user: IZUser;

    beforeEach(() => {
      user = new ZUserBuilder().email('gambit@marvel.com').password('not-really-secure').inactive(v4()).build();

      users.findByEmail.mockReturnValue(Promise.resolve(user));
      users.activate.mockReturnValue(Promise.resolve(user));
      users.deactivate.mockReturnValue(Promise.resolve(user));
    });

    it('sends the activation email with the activator key.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.sendActivationEmail(user);
      // Assert
      expect(email.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining(user.activator.key) }), smtp.value);
    });

    it('activates the user with the given email.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.activate(user.email);
      // Assert
      expect(users.activate).toHaveBeenCalledWith(user);
    });

    it('deactivates the user with the given email.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.deactivate(user.email);
      // Assert
      expect(users.deactivate).toHaveBeenCalledWith(user);
    });

    it('deactivate the user before sending the activation mail.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.reactivate(user.email);
      // Assert
      expect(users.deactivate).toHaveBeenCalledWith(user);
    });

    it('sends the activation email after deactivating the user.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.reactivate(user.email);
      // Assert
      expect(email.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining(user.activator.key) }), smtp.value);
    });
  });

  describe('Recovery', () => {
    let user: IZUser;
    let generated: string;

    beforeEach(() => {
      generated = v4();
      user = new ZUserBuilder().email('gambit@marvel.com').password('not-really-secure').recover(generated).inactive(v4()).build();

      users.findByEmail.mockReturnValue(Promise.resolve(user));
      users.recover.mockReturnValue(Promise.resolve(generated));
    });

    it('does not send an email if the user does not have a password generated.', async () => {
      // Arrange
      const target = createTestTarget();
      users.recover.mockResolvedValue(null);
      // Act
      await target.recoverPassword(user.email);
      // Assert
      expect(email.sendEmail).not.toHaveBeenCalled();
    });

    it('sends the email with the generated password.', async () => {
      // Arrange
      const target = createTestTarget();
      const expected = expect.objectContaining<Partial<IZEmail>>({ message: expect.stringContaining(generated) });
      // Act
      await target.recoverPassword(user.email);
      // Assert
      expect(email.sendEmail).toHaveBeenCalledWith(expected, smtp.value);
    });

    it('sends the email with the expiration date.', async () => {
      // Arrange
      const target = createTestTarget();
      const date = new Date(user.recovery.exp).toLocaleString();
      const expected = expect.objectContaining<Partial<IZEmail>>({ message: expect.stringContaining(date) });
      // Act
      await target.recoverPassword(user.email);
      // Assert
      expect(email.sendEmail).toHaveBeenCalledWith(expected, smtp.value);
    });
  });
});
