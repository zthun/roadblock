import { IsNotWhiteSpace } from '@zthun/works.class';
import { IZLogin } from '@zthun/works.core';
import { Allow, IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Represents the DTO to login to the system.
 */
export class ZTokensLoginDto implements IZLogin {
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'The email must be a valid user@domain email.' })
  /**
   * The email to generate the token for.
   */
  public email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotWhiteSpace({ message: 'Password cannot be white space.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  /**
   * The password  to check against.
   */
  public password: string;

  @Allow()
  /**
   * Ignored.  You can set this but it doesn't do anything in this case.
   */
  public confirm?: string;
}
