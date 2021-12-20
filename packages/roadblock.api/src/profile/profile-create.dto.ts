import { EqualsOtherProperty, IsNotWhiteSpace } from '@zthun/works.class';
import { IZLogin } from '@zthun/works.core';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Represents the DTO for creating a new profile login.
 */
export class ZProfileCreateDto implements IZLogin {
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'The email must be a valid user@domain email.' })
  /**
   * The email to create the account from.
   */
  public email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotWhiteSpace({ message: 'Password cannot be white space.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  /**
   * The password for the account.
   */
  public password: string;

  @IsString({ message: 'Password confirmation must be a string.' })
  @IsNotWhiteSpace({ message: 'Password confirmation cannot be white space.' })
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters.' })
  @EqualsOtherProperty<IZLogin>('password', { message: 'Passwords do not match' })
  /**
   * The password confirmation.  Must match the password field.
   */
  public confirm: string;
}
