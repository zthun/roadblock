import { cloneDeep, isUndefined, omitBy } from "lodash-es";

/**
 * Represents a person whom you can identify.
 *
 * This is the minimum amount of information needed
 * to identify a user in a zthunworks system.
 */
export interface IZIdentity {
  /**
   * The id of the identity record.
   */
  id?: string;

  /**
   * The user's email address.
   *
   * This is the primary login.
   */
  email?: string;
}

/**
 * Builds a person's identity using chainable setters.
 *
 * @remarks
 * All identity fields are optional. Each call to {@link ZIdentityBuilder.build}
 * returns a new identity object and a copy of its name, when present.
 *
 * @example
 * ```ts
 * const identity = new ZIdentityBuilder()
 *   .email("jane@example.com")
 *   .build();
 * ```
 */
export class ZIdentityBuilder {
  private _identity: IZIdentity = {};

  /**
   * Sets the id of the person record.
   *
   * @param id -
   *        The id of the person
   *
   * @returns
   *        This builder
   *
   */
  public id(id?: string): this {
    this._identity.id = id;

    return this;
  }

  /**
   * Sets the person's email address.
   *
   * @param email -
   *        The email address used as the primary login
   *
   * @returns
   *        This builder
   */
  public email(email?: string): this {
    this._identity.email = email;
    return this;
  }

  /**
   * Copies another identity into this builder, replacing its current fields.
   *
   * @param other -
   *        The identity to copy, including its name when present
   *
   * @returns
   *        This builder
   */
  public copy(other: IZIdentity): this {
    this._identity = { ...other };

    return this;
  }

  /**
   * Creates an identity from the current fields.
   *
   * @returns
   *        A new identity and name unaffected by later builder changes
   */
  public build(): IZIdentity {
    const clone = cloneDeep(this._identity);

    return omitBy(clone, isUndefined);
  }
}
