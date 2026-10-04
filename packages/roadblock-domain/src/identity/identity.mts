import { cloneDeep, isUndefined, omitBy } from "lodash-es";

import { type IZFullName, ZFullNameBuilder } from "../full-name/full-name.mjs";

/**
 * Represents a person whom you can identify.
 *
 * This is the minimum amount of information needed
 * to identify a user in a zthunworks system.
 */
export interface IZIdentity {
  /**
   * The user's email address.
   *
   * This is the primary login.
   */
  email?: string;

  /**
   * The person's name.
   *
   * This can be used for display purposes.
   *
   * Hello (FirstName), welcome to (My App).
   */
  name?: IZFullName;
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
 *   .name(new ZFullNameBuilder().given("Jane").family("Doe").build())
 *   .build();
 * ```
 */
export class ZIdentityBuilder {
  private _identity: IZIdentity = {};

  /**
   * Sets the person's email address.
   *
   * @param email -
   *        The email address used as the primary login.
   *
   * @returns
   *        This builder for chaining.
   */
  public email(email?: string): this {
    this._identity.email = email;
    return this;
  }

  /**
   * Sets the person's full name.
   *
   * @param name -
   *        The full name to copy.  If you pass undefined,
   *        the name property will be removed.
   *
   * @returns
   *        This builder for chaining.
   */
  public name(name?: IZFullName): this {
    this._identity.name = name
      ? new ZFullNameBuilder().copy(name).build()
      : undefined;

    return this;
  }

  /**
   * Copies another identity into this builder, replacing its current fields.
   *
   * @param other -
   *        The identity to copy, including its name when present.
   *
   * @returns
   *        This builder for chaining.
   */
  public copy(other: IZIdentity): this {
    this._identity = { ...other };

    return this.name(other.name);
  }

  /**
   * Creates an identity from the current fields.
   *
   * @returns
   *        A new identity and name unaffected by later builder changes.
   */
  public build(): IZIdentity {
    const clone = cloneDeep(this._identity);

    return omitBy(clone, isUndefined);
  }
}
