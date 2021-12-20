import { Injectable } from '@nestjs/common';
import { IZEmail, IZLogin, IZProfile, IZUser, ZEmailBuilder, ZEmailEnvelopeBuilder, ZProfileBuilder } from '@zthun/works.core';
import { ZNotificationsClient, ZUsersClient } from '@zthun/works.microservices';
import { ZWorksConfigService } from '@zthun/works.nest';

@Injectable()
/**
 * Represents a service that manages profiles and users.
 */
export class ZProfilesService {
  /**
   * Initializes a new instance of this object.
   *
   * @param _users The users service.
   * @param _notifications The notifications service.
   * @param _config The common configuration service.
   * @param _notificationsConfig The notifications configuration service.
   */
  public constructor(private _users: ZUsersClient, private _notifications: ZNotificationsClient, private _config: ZWorksConfigService) {}

  /**
   * Creates a profile object from a login.
   *
   * @param login The login to construct the new user and profile.
   *
   * @returns A promise that resolves to the profile that represents the user created.
   */
  public async create(login: IZLogin): Promise<IZProfile> {
    const user = await this._users.create(login);

    if (user.activator) {
      await this.sendActivationEmail(user);
    }

    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Updates a user from a profile.
   *
   * @param current The current user before the update.
   * @param profile The profile to update the user with.
   *
   * @returns A promise that resolves to the profile of the user updated.
   */
  public async update(current: IZUser, profile: IZProfile): Promise<IZProfile> {
    const user = await this._users.update(current._id, profile);

    if (user.activator) {
      await this.sendActivationEmail(user);
    }

    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Removes a user.
   *
   * @param current The user to remove.
   *
   * @returns A promise that resolves the profile that was removed.
   */
  public async remove(current: IZUser): Promise<IZProfile> {
    const user = await this._users.remove(current._id);
    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Sends the activation email for a user.
   *
   * @param user The user to send the activation email for.
   *
   * @returns A promise that resolves the email sent.
   */
  public async sendActivationEmail(user: IZUser): Promise<IZEmail> {
    const server = await this._config.smtp();
    const domain = await this._config.domain();
    const notifier = await this._config.notifier();
    const envelope = new ZEmailEnvelopeBuilder().to(user.email).from(notifier.value).build();
    const subject = `Welcome to ${domain.value}`;
    const msg = `<h1>Welcome to ${domain.value}</h1>
      <p>You must activate your account before you can do anything with your profile.  Your activation code is:</p>
      <p><strong>${user.activator.key}</strong></p>
      <p>Your activation code is only good for a limited time.</p>
      <p>Thanks for joining ${domain.value}.  We hope you enjoy your stay.</p>
    `;
    const email = new ZEmailBuilder().message(msg).subject(subject).envelope(envelope).build();
    await this._notifications.sendEmail(email, server.value);
    return email;
  }

  /**
   * Activates a user.
   *
   * @param email The email of the user to activate.
   *
   * @returns A promise that, when resolved, has activated the user with the given email.
   */
  public async activate(email: string): Promise<IZProfile> {
    let user = await this._users.findByEmail(email);
    user = await this._users.activate(user);
    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Deactivates a user.
   *
   * This does not send an activation email.  If you need to send an activation email
   * along with the activation key, the user reactivate instead.
   *
   * @param email The email of the user to deactivate.
   *
   * @returns A promise that, when resolved, has deactivated the user with the given email.
   */
  public async deactivate(email: string): Promise<IZProfile> {
    const user = await this._deactivateEmail(email);
    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Deactivates the user and sends the user activation email.
   *
   * @param email The email of the user to deactivate and send the email to.
   *
   * @returns A promise that, when resolved, has deactivated the user with the given email.
   */
  public async reactivate(email: string): Promise<IZProfile> {
    const user = await this._deactivateEmail(email);
    await this.sendActivationEmail(user);
    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Sets up the recover password for an email.
   *
   * @param email The email to potentially send to if it exists in the system.
   *
   * @returns A promise that resolves when the operation is finished, whether an
   *          recovery message was sent or not.
   */
  public async recoverPassword(email: string): Promise<void> {
    const generated = await this._users.recover(email);

    if (generated) {
      const user = await this._users.findByEmail(email);
      await this.sendRecoveryEmail(email, generated, user.recovery.exp);
    }
  }

  /**
   * Sends the recovery email.
   *
   * @param address The address to send to.
   * @param generated The generated password.
   * @param exp The expiration date.
   */
  public async sendRecoveryEmail(address: string, generated: string, exp: number): Promise<IZEmail> {
    const server = await this._config.smtp();
    const domain = await this._config.domain();
    const notifier = await this._config.notifier();
    const envelope = new ZEmailEnvelopeBuilder().to(address).from(notifier.value).build();
    const date = new Date(exp).toLocaleString();
    const time = new Date().toLocaleString();
    const subject = `Password recovery for ${domain.value}`;
    const msg = `<h1>Password Recovery</h1>
      <p>A password recovery was requested for your account. You may use this generated password only one time.</p>
      <p><strong>${generated}</strong></p>
      <p>This password is good until <strong>${date}</strong> and the current server time is ${time}.</p>
      <p>If you did not make this request, then it is recommended to log into the system and update your email/password as someone may be trying to access your account.</p>`;

    const email = new ZEmailBuilder().message(msg).subject(subject).envelope(envelope).build();
    await this._notifications.sendEmail(email, server.value);
    return email;
  }

  /**
   * Deactivates a user.
   *
   * @param email The email address of the user to deactivate.
   *
   * @returns The user that was deactivated.
   */
  private async _deactivateEmail(email: string): Promise<IZUser> {
    let user = await this._users.findByEmail(email);
    user = await this._users.deactivate(user);
    return user;
  }
}
