/**
 * Represents a login to the system.
 *
 * This is used for creating and posting tokens.  This object is non storable.
 */
export interface IZLogin {
  /**
   * The login email.
   */
  email: string;

  /**
   * The login password.
   */
  password: string;

  /**
   * The password confirmation.
   *
   * Required when creating a user or updating a user.
   */
  confirm?: string;
}

/**
 * Represents a build for a login object.
 */
export class ZLoginBuilder {
  private _login: IZLogin;

  /**
   * Initializes a new instance of this object.
   */
  public constructor() {
    this._login = {
      email: '',
      password: ''
    };
  }

  /**
   * Copies another instance of a login object to this object.
   *
   * @param other The login object to copy.
   *
   * @returns This object.
   */
  public copy(other: IZLogin): this {
    this._login.email = other.email;
    this._login.password = other.password;
    this._login.confirm = other.confirm;
    return this;
  }

  /**
   * Sets the email.
   *
   * @param val The value to set.
   *
   * @returns This object.
   */
  public email(val: string): ZLoginBuilder {
    this._login.email = val;
    return this;
  }

  /**
   * Sets the password.
   *
   * @param val The value to set.
   *
   * @returns This object.
   */
  public password(val: string): this {
    this._login.password = val;
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
    this._login.confirm = val;
    return this;
  }

  /**
   * Sets the email confirm field to the password field.
   *
   * @returns This object.
   */
  public autoConfirm(): this {
    this._login.confirm = this._login.password;
    return this;
  }

  /**
   * Returns a copy of the built object.
   *
   * @returns A copy of the built object.
   */
  public build() {
    return { ...this._login };
  }
}
