import { IZUser } from '../users/user';

/**
 * The standard height and width of the profile avatar.
 */
export const ZProfileAvatarSize = 256;

/**
 * The maximum number of bytes for an avatar.
 *
 * The current default is 128KB.
 */
export const ZProfileAvatarMaxBytes = 131072;

/**
 * Represents an object that can be used to update various fields of a user.
 */
export interface IZProfile {
  /**
   * The user email.
   *
   * This should always be sent back when the user
   * requests their profile information, but can
   * be empty when updating meaning that the user
   * does not want to change their email.
   */
  email?: string;

  /**
   * The display name of the user.
   */
  display?: string;

  /**
   * The password to update to.
   *
   * This should never be returned to the user.  It is here
   * to allow the user to update his or her password.
   */
  password?: string;

  /**
   * The password confirmation if the password is to change.
   *
   * This should match the password property if it is to be updated and
   * must never be sent back to any client.
   */
  confirm?: string;

  /**
   * A value that indicates if the profile has been activated.
   *
   * This should always be sent back when the user requests their
   * profile (for better UI experience), but, like the super flag,
   * cannot be set.
   */
  active?: boolean;

  /**
   * A url to an avatar.
   */
  avatar?: string;
}

/**
 * Represents an builder that can create a profile object.
 */
export class ZProfileBuilder {
  private _profile: IZProfile = {};

  /**
   * Sets the email.
   *
   * @param val The value to set.
   *
   * @returns This object.
   */
  public email(val: string): this {
    this._profile.email = val;
    return this;
  }

  /**
   * Sets the display.
   *
   * @param val The value to set.
   *
   * @returns This object.
   */
  public display(val: string | undefined): this {
    this._profile.display = val;
    return this;
  }

  /**
   * Sets the users current password.
   *
   * @param val The value to set.
   *
   * @returns This object.
   */
  public password(val: string): this {
    this._profile.password = val;
    return this;
  }

  /**
   * Sets the password confirmation.
   *
   * @param val The value to set.
   *
   * @returns This object.
   */
  public confirm(val: string): this {
    this._profile.confirm = val;
    return this;
  }

  /**
   * Sets the confirmation to the newPassword.
   *
   * @returns This object.
   */
  public autoConfirm(): this {
    this._profile.confirm = this._profile.password;
    return this;
  }

  /**
   * Marks the profile as active.
   *
   * @returns This object.
   */
  public active(): this {
    this._profile.active = true;
    return this;
  }

  /**
   * Sets the users avatar url.
   *
   * @param url The avatar url.
   *
   * @returns This object.
   */
  public avatar(url: string | undefined): this {
    this._profile.avatar = url;
    return this;
  }

  /**
   * Assigns other properties from a profile to the current profile.
   *
   * @param other The partial object to copy.
   *
   * @returns This object.
   */
  public assign(other: Partial<IZProfile>): this {
    this._profile = Object.assign({}, this._profile, other);
    return this;
  }

  /**
   * Copies all properties from a profile to this profile object.
   *
   * @param other The object to copy.
   *
   * @returns This object.
   */
  public copy(other: IZProfile): this {
    this._profile = Object.assign(this._profile, other);
    return this;
  }

  /**
   * Constructs the profile object from the user.
   *
   * This basically sets the email, display, and super flag.
   *
   * @param user The user to construct the profile from.
   *
   * @returns This object.
   */
  public user(user: IZUser): this {
    this._profile.email = user.email;
    this._profile.display = user.display;
    this._profile.active = !user.activator;
    this._profile.avatar = user.avatar;
    return this;
  }

  /**
   * Returns a copy of the built profile.
   *
   * @returns A copy of the built profile.
   */
  public build(): IZProfile {
    return { ...this._profile };
  }
}
