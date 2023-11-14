import { IZLogin, IZProfile, IZProfileActivation } from '@zthun/works.core';
import { IZHttpService, ZHttpRequestBuilder, ZHttpService } from '@zthun/works.http';
import { ZUrlBuilder } from '@zthun/works.url';
import { createContext, useContext } from 'react';

/**
 * Represents a service to retrieve information about profiles in the zthunworks system.
 */
export interface IZProfileService {
  /**
   * Creates a new profile.
   *
   * @param credentials The login credentials.
   *
   * @returns A promise that resolves with the new login profile,
   *          or a promise that rejects with an error.
   */
  create(credentials: IZLogin): Promise<IZProfile>;

  /**
   * Gets the current profile from the standard api.
   *
   * This is the same invocation as the identity service read, except
   * this will return a 401 instead of a 201 if the profile is not logged in.
   *
   * @returns A promise that returns the current profile information.
   */
  read(): Promise<IZProfile>;

  /**
   * Updates the user profile.
   */
  update(profile: Partial<IZProfile>): Promise<IZProfile>;

  /**
   * Deletes the users profile.
   */
  delete(): Promise<void>;

  /**
   * Logs the user into the system.
   *
   * @param credentials The credentials to use when logging in.
   *
   * @returns A promise that resolves with a profile that was logged in.
   */
  login(credentials: IZLogin): Promise<IZProfile>;

  /**
   * Logs the user out of the system.
   *
   * @returns A promise that resolves with a successful logout and rejects
   *          if the endpoint cannot be reached.
   */
  logout(): Promise<void>;

  /**
   * Sends a recovery email to the given login.
   *
   * @returns A promise that resolves with a recovery login or a rejected
   *          promise if the operation failed.
   */
  recover(credentials: IZLogin): Promise<void>;

  /**
   * Activates the users profile.
   *
   * @param activation The activation key used to activate the profile.
   *
   * @returns A promise that returns the updated profile.
   */
  activate(activation: IZProfileActivation): Promise<IZProfile>;

  /**
   * Deactivates the users profile.
   *
   * @returns A promise that returns the updated profile.
   */
  deactivate(): Promise<IZProfile>;

  /**
   * Reactivates the users profile.
   *
   * This should send the user a new activation email with an updated
   * key.
   *
   * @param activation The activation that targets the specified email to activate.
   *
   * @returns A promise that returns the updated profile.
   */
  reactivate(activation: IZProfileActivation): Promise<IZProfile>;
}

/**
 * Represents the standard implementation of the profile service.
 */
export class ZProfileService implements IZProfileService {
  /**
   * Gets the standard rest api url for retrieving and updating profiles.
   *
   * @returns The url for the standard profiles rest api.
   */
  public static createProfilesUrl() {
    return new ZUrlBuilder().api().append('profiles').build();
  }

  /**
   * Gets the url for the tokens service.
   *
   * @returns The url for the tokens rest api.
   */
  public static createTokensUrl(): string {
    return new ZUrlBuilder().api().append('tokens').build();
  }

  /**
   * Gets the url for the profile recovery service.
   *
   * @returns The url for the profile recovery api.
   */
  public static createRecoveryUrl(): string {
    return new ZUrlBuilder().api().append('profiles').append('recoveries').build();
  }

  /**
   * Gets the url for profile activation.
   *
   * @returns The url for the activation rest api.
   */
  public static createActivationsUrl(): string {
    return new ZUrlBuilder().api().append('profiles').append('activations').build();
  }

  /**
   * Initializes a new instance of this object.
   *
   * @param _http The http service to invoke rest api calls.
   */
  public constructor(private _http: IZHttpService) {}

  /**
   * Creates a new profile.
   *
   * @param credentials The login credentials.
   *
   * @returns A promise that resolves with the new login profile,
   *          or a promise that rejects with an error.
   */
  public async create(credentials: IZLogin): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().post(credentials).url(ZProfileService.createProfilesUrl()).build();
    const res = await this._http.request(req);
    return res.data;
  }

  /**
   * Gets the current profile.
   *
   * @returns A promise that returns the current profile information.  This returns a rejected promise
   *          if the user is not logged in.
   */
  public async read(): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().get().url(ZProfileService.createProfilesUrl()).build();
    const response = await this._http.request(req);
    return response.data;
  }

  /**
   * Updates the current users profile.
   *
   * @param profile The profile information to update.
   *
   * @returns The updated profile.
   */
  public async update(profile: Partial<IZProfile>): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().put(profile).url(ZProfileService.createProfilesUrl()).build();
    const result = await this._http.request<IZProfile>(req);
    return result.data;
  }

  /**
   * Deletes the current users profile.
   */
  public async delete(): Promise<void> {
    const req = new ZHttpRequestBuilder().delete().url(ZProfileService.createProfilesUrl()).build();
    await this._http.request(req);
  }

  /**
   * Logs the user into the system.
   *
   * @param credentials The credentials to use when logging in.
   *
   * @returns A promise that resolves with a successful login and rejects
   *          if the credentials are invalid.
   */
  public async login(credentials: IZLogin): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().post(credentials).url(ZProfileService.createTokensUrl()).build();
    await this._http.request(req);
    return this.read();
  }

  /**
   * Logs the user out of the system.
   *
   * @returns A promise that resolves with a successful logout and rejects
   *          if the endpoint cannot be reached.
   */
  public async logout(): Promise<void> {
    const req = new ZHttpRequestBuilder().delete().url(ZProfileService.createTokensUrl()).build();
    await this._http.request(req);
  }

  /**
   * Sends a recovery email to the given login.
   *
   * @param credentials The login to recover.
   *
   * @returns A promise that resolves with a recovery login or a rejected
   *          promise if the operation failed.
   */
  public async recover(credentials: IZLogin): Promise<void> {
    const req = new ZHttpRequestBuilder().post(credentials).url(ZProfileService.createRecoveryUrl()).build();
    await this._http.request(req);
  }

  /**
   * Activates the users profile.
   *
   * @param activation The activation key used to activate the profile.
   *
   * @returns A promise that returns the updated profile.
   */
  public async activate(activation: IZProfileActivation): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().put(activation).url(ZProfileService.createActivationsUrl()).build();
    const actual = await this._http.request(req);
    return actual.data;
  }

  /**
   * Deactivates the users profile.
   *
   * @returns A promise that returns the updated profile.
   */
  public async deactivate(): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().delete().url(ZProfileService.createActivationsUrl()).build();
    const actual = await this._http.request(req);
    return actual.data;
  }

  /**
   * Reactivates the users profile.
   *
   * This should send the user a new activation email with an updated
   * key.
   *
   * @param activation The activation that targets the specified email to activate.
   *
   * @returns A promise that returns the updated profile.
   */
  public async reactivate(activation: IZProfileActivation): Promise<IZProfile> {
    const req = new ZHttpRequestBuilder().post(activation).url(ZProfileService.createActivationsUrl()).build();
    const actual = await this._http.request(req);
    return actual.data;
  }
}

/**
 * The context provider that holds the profile service.
 */
export const ZProfileServiceContext = createContext<IZProfileService>(new ZProfileService(new ZHttpService()));

/**
 * Returns the context profile service.
 *
 * @returns The profile service.
 */
export function useProfileService(): IZProfileService {
  return useContext(ZProfileServiceContext);
}
