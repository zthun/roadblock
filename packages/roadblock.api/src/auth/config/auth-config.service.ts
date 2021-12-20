import { Injectable, OnModuleInit } from '@nestjs/common';
import { IZConfigEntry, ZConfigEntryBuilder } from '@zthun/works.core';
import { ZVaultClient } from '@zthun/works.microservices';

@Injectable()
/**
 * Represents a service for configuration for the auth module throughout the system.
 */
export class ZAuthConfigService implements OnModuleInit {
  /**
   * The scope for the common config.
   */
  public static readonly SCOPE = 'authentication';

  /**
   * The key for the jwt secret.
   */
  public static readonly KEY_JWT = 'jwt';

  /**
   * Initializes a new instance of this object.
   *
   * @param _vault The service for reading and writing to the vault.
   */
  public constructor(private readonly _vault: ZVaultClient) {}

  /**
   * Initializes this service.
   *
   * @returns A promise that, when resolved, has initialized all configurations.
   */
  public async onModuleInit(): Promise<any> {
    return Promise.all([this.jwt()]);
  }

  /**
   * Gets the current jwt secret.
   *
   * @returns A promise that, when resolved, has returned the core jwt secret handshake value.
   */
  public async jwt(): Promise<IZConfigEntry<string>> {
    const config = new ZConfigEntryBuilder<string>().scope(ZAuthConfigService.SCOPE).key(ZAuthConfigService.KEY_JWT).generate().build();
    return this._vault.get<string>(config);
  }
}
