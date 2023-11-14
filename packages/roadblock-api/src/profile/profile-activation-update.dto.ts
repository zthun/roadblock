import { IsNotWhiteSpace } from '@zthun/works.class';
import { IZProfileActivation } from '@zthun/works.core';
import { IsEmail, IsString } from 'class-validator';

/**
 * Represents the dto for updating an activation.
 */
export class ZProfileActivationUpdateDto implements IZProfileActivation {
  @IsString({ message: 'Activation email must be a string.' })
  @IsEmail({}, { message: 'Activation email must be a valid email.' })
  /**
   * The email to activate.
   */
  public email: string;

  @IsString({ message: 'Activation key must be a string.' })
  @IsNotWhiteSpace({ message: 'Activation key must not be white space.' })
  /**
   * The activation key.
   */
  public key: string;
}
