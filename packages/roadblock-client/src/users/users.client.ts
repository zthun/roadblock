import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IZLogin, IZProfile, IZUser } from '@zthun/works.core';
import { lastValueFrom } from 'rxjs';

@Injectable()
/**
 * Represents a service to manage the user database with business rules.
 */
export class ZUsersClient {
  /**
   * Initializes a new instance of this object.
   *
   * @param _dal The data access layer.
   */
  public constructor(@Inject('Users.Service') private readonly _users: ClientProxy) {}

  /**
   * Gets a specific user by their id.
   *
   * @param _id The id of the user to find.
   *
   * @returns A promise that, when resolved, has the found user.  Returns null if no such user exists.
   */
  public async findById(_id: string): Promise<IZUser | null> {
    return lastValueFrom(this._users.send({ cmd: 'find' }, { _id }));
  }

  /**
   * Gets a specific user by their email.
   *
   * @param email The email of the user to find.
   *
   * @returns A promise that, when resolved, has the found user by their email.  Returns null if no such user exists.
   */
  public async findByEmail(email: string): Promise<IZUser | null> {
    return lastValueFrom(this._users.send({ cmd: 'find' }, { email }));
  }

  /**
   * Creates a new user.
   *
   * @param login The user to create from a login configuration.
   *
   * @returns A promise that, when resolved, has returned the new user.
   */
  public async create(login: IZLogin): Promise<IZUser> {
    return lastValueFrom(this._users.send({ cmd: 'create' }, { login }));
  }

  /**
   * Updates an existing user.
   *
   * @param id The id of the user to update.
   * @param profile The profile template to update the user with.
   *
   * @returns A promise that, when resolved, has returned the updated user.  Returns null if no such user exists.
   */
  public async update(id: string, profile: IZProfile): Promise<IZUser | null> {
    return lastValueFrom(this._users.send({ cmd: 'update' }, { id, profile }));
  }

  /**
   * Activates a user.
   *
   * @param user The user to activate.
   *
   * @returns A promise that, when resolved, returns the updated user.
   */
  public async activate(user: IZUser): Promise<IZUser> {
    return lastValueFrom(this._users.send({ cmd: 'activate' }, { user }));
  }

  /**
   * Deactivates a user.
   *
   * This simply copies the existing user and adds a new activation code.  If the user is already
   * deactivated, then a new activation code is set with an updated expiration.
   *
   * @param user The user to deactivate.
   *
   * @returns A promise that, when resolved, returns the updated user.
   */
  public async deactivate(user: IZUser): Promise<IZUser> {
    return lastValueFrom(this._users.send({ cmd: 'deactivate' }, { user }));
  }

  /**
   * Sets the user up for a password recovery.
   *
   * @param email The email of the account to recover.
   *
   * @returns A promise that resolves to the generated password for the user with the expiration date.  Resolves to null if no user with the given email exists.
   */
  public async recover(email: string): Promise<string | null> {
    return lastValueFrom(this._users.send({ cmd: 'recover' }, { email }));
  }

  /**
   * Timestamps the user login.
   *
   * @param id The id of the account to login.
   *
   * @returns A promise that, when resolved, has returned the updated user.  Returns null if no such user exists.
   */
  public async login(id: string): Promise<IZUser | null> {
    return lastValueFrom(this._users.send({ cmd: 'login' }, { id }));
  }

  /**
   * Deletes an existing user.
   *
   * @param id The id of the user to  delete.
   *
   * @returns A promise that, when resolve, has returned the deleted user.  Returns null if no such user exists.
   */
  public async remove(id: string): Promise<IZUser | null> {
    return lastValueFrom(this._users.send({ cmd: 'remove' }, { id }));
  }

  /**
   * Compares the user and password to make sure it matches.
   *
   * @param credentials The credentials to check and compare with what is stored in the database.
   *
   * @returns A promise that resolves to true if the credentials match.  False if they do not.
   */
  public async compare(credentials: IZLogin): Promise<boolean> {
    return lastValueFrom(this._users.send({ cmd: 'compare' }, { credentials }));
  }
}
