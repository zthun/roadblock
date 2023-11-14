/**
 * Represents a static class for constants regarding the users database.
 */
export abstract class ZUsersDatabase {
  /**
   * The database injection token.
   */
  public static readonly Token = 'DATABASE.USERS';

  /**
   * The database name.
   */
  public static readonly Name = 'users';
}

/**
 * Represents a store of constants for database user collections.
 */
export abstract class ZUsersCollections {
  /**
   * The users collection.
   */
  public static readonly Users = 'users';
}
