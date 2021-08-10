import { IZLogin } from '@zthun/works.core';
import { IsEmail, IsString } from 'class-validator';

/**
 * Represents the DTO for creating a profile login recovery.
 */
export class ZProfileRecoveryCreateDto implements IZLogin {
  @IsString({ message: 'Recovery email must be a string.' })
  @IsEmail({}, { message: 'Recovery email must be a valid email.' })
  /**
   * The email to create the recovery password for.
   */
  public email: string;
}
