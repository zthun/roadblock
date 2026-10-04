import { cloneDeep, isUndefined, omitBy } from "lodash-es";

/**
 *  A person's full name split into parts and segments.
 */
export interface IZFullName {
  /**
   * The user's given name (first name).
   */
  given?: string;

  /**
   * The user's family name (last name).
   */
  family?: string;

  /**
   * The user's middle name.
   */
  middle?: string;

  /**
   * The user's prefix (Mr. Ms. Mrs.).
   */
  prefix?: string;

  /**
   * The user's suffix (Jr. Sr.).
   */
  suffix?: string;
}

/**
 * Builds a person's full name using chainable setters.
 *
 * @remarks
 * All name parts are optional. Each call to {@link ZFullNameBuilder.build}
 * returns a new object containing the current name parts.
 *
 * @example
 * ```ts
 * const name = new ZFullNameBuilder()
 *   .given("Jane")
 *   .family("Doe")
 *   .prefix("Dr.")
 *   .build();
 * ```
 */
export class ZFullNameBuilder {
  private _fullName: IZFullName = {};

  /**
   * Sets the person's given name.
   *
   * @param name -
   *        The first name.
   *
   * @returns
   *        This builder for chaining.
   */
  public given(name: string): this {
    this._fullName.given = name;
    return this;
  }

  /**
   * Sets the person's family name.
   *
   * @param name -
   *        The last name.
   *
   * @returns
   *        This builder for chaining.
   */
  public family(name: string): this {
    this._fullName.family = name;
    return this;
  }

  /**
   * Sets the person's middle name.
   *
   * @param name -
   *        The middle name.
   *
   * @returns
   *        This builder for chaining.
   */
  public middle(name: string): this {
    this._fullName.middle = name;
    return this;
  }

  /**
   * Sets the person's name prefix.
   *
   * @param name -
   *        The prefix, such as "Mr.", "Ms.", or "Dr.".
   *
   * @returns
   *        This builder for chaining.
   */
  public prefix(name: string): this {
    this._fullName.prefix = name;
    return this;
  }

  /**
   * Sets the person's name suffix.
   *
   * @param name -
   *        The suffix, such as "Jr." or "Sr.".
   *
   * @returns
   *        This builder for chaining.
   */
  public suffix(name: string): this {
    this._fullName.suffix = name;
    return this;
  }

  /**
   * Copies other into the current full name object.
   *
   * @param other -
   *        The other full name to copy.
   *
   * @returns
   *        This builder for chaining.
   */
  public copy(other: IZFullName): this {
    this._fullName = { ...other };
    return this;
  }

  /**
   * Creates a full name from the current name parts.
   *
   * @returns A new full name object unaffected by later builder changes.
   */
  public build(): IZFullName {
    const clone = cloneDeep(this._fullName);

    return omitBy(clone, isUndefined);
  }
}
