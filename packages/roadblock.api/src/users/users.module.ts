/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ZDatabaseMongo, ZDatabaseOptionsBuilder } from '@zthun/works.dal';
import { env } from 'process';
import { ZUsersDatabase } from './users.database';
import { ZUsersService } from './users.service';

const DATABASE_URL = env.DATABASE_USERS_URL || env.DATABASE_URL || null;
const DATABASE_OPTIONS = new ZDatabaseOptionsBuilder().database(ZUsersDatabase.Name).url(DATABASE_URL).build();

@Module({
  providers: [ZUsersService, { provide: ZUsersDatabase.Token, useValue: ZDatabaseMongo.connect(DATABASE_OPTIONS) }],
  exports: [ZUsersService]
})
/**
 * Represents the module that handles users.
 */
export class ZUsersModule {}
