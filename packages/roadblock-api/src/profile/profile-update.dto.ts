import { EqualsOtherProperty, IsDataURILimit, IsDataURIType, IsNotWhiteSpace } from '@zthun/works.class';
import { IZProfile, ZProfileAvatarMaxBytes } from '@zthun/works.core';
import { IsDataURI, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Represents the DTO to update a profile.
 */
export class ZProfileUpdateDto implements Partial<IZProfile> {
  @IsOptional()
  @IsString({ message: 'Display must be a string.' })
  /**
   * The display name.
   */
  public display?: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'The email must be a valid user@domain email.' })
  /**
   * The email to update to.
   */
  public email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  @IsNotWhiteSpace({ message: 'Password cannot be white space.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  /**
   * Updated password.
   */
  public password?: string;

  @IsOptional()
  @IsString({ message: 'Password confirmation must be a string.' })
  @IsNotWhiteSpace({ message: 'Password confirmation cannot be white space.' })
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters.' })
  @EqualsOtherProperty<IZProfile>('password', { message: 'New passwords do not match' })
  /**
   * The password confirmation.  Must match the password field.
   */
  public confirm?: string;

  @IsOptional()
  @IsString({ message: 'The avatar must be a string.' })
  @IsDataURI({ message: 'The avatar must be a data uri.  External cross origin urls are not supported.' })
  @IsDataURIType(['image/png'], { message: 'The avatar data uri must be a png image.' })
  @IsDataURILimit(0, ZProfileAvatarMaxBytes, { message: 'The avatar storage size is too big.  Your avatar must encode to less than 128KB.  Use gravatar if you would like to use larger images.' })
  /**
   * The avatar data uri.
   */
  public avatar?: string;
}
