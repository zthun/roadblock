import { useAsyncState } from '@zthun/helpful-react';
import { IZHttpService, ZHttpRequestBuilder, ZHttpService } from '@zthun/webigail-http';
import { ZUrlBuilder } from '@zthun/webigail-url';
import { IZProfile } from '@zthun/works.core';
import { createContext, useContext } from 'react';

/**
 * Represents a service to retrieve information about profiles in the zthunworks system.
 */
export interface IZIdentityService {
  /**
   * Reads the current profile from the standard api.
   *
   * @returns A promise that returns the current profile information.
   */
  read(): Promise<IZProfile | null>;
}

/**
 * Represents the standard implementation of the profile service.
 */
export class ZIdentityService implements IZIdentityService {
  /**
   * Gets the standard rest api url for retrieving and updating profiles.
   *
   * @returns The url for the standard profiles rest api.
   */
  public static createIdentityUrl() {
    return new ZUrlBuilder().api(location).append('identity').build();
  }

  /**
   * Initializes a new instance of this object.
   *
   * @param _http The http service to invoke rest api calls.
   */
  public constructor(private _http: IZHttpService) {}

  /**
   * Gets the current profile from the standard api.
   *
   * @returns A promise that returns the current profile information.
   */
  public async read(): Promise<IZProfile | null> {
    try {
      const req = new ZHttpRequestBuilder().get().url(ZIdentityService.createIdentityUrl()).build();
      const response = await this._http.request(req);
      return response.data || null;
    } catch (err) {
      return null;
    }
  }
}

/**
 * The context provider that holds the profile service.
 */
export const ZIdentityServiceContext = createContext<IZIdentityService>(new ZIdentityService(new ZHttpService()));

/**
 * Returns the context profile service.
 *
 * @returns The profile service.
 */
export function useIdentityService() {
  return useContext(ZIdentityServiceContext);
}

/**
 * Uses the global profile.
 *
 * @returns The global profile.
 */
export function useIdentity() {
  const service = useIdentityService();
  return useAsyncState(() => service.read());
}
