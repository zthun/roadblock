import { IZProfileActivation } from '@zthun/works.core';
import { Equals, IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Represents the DTO for creating a profile activation.
 */
export class ZProfileActivationCreateDto implements IZProfileActivation {
  @IsString({ message: 'Activation email must be a string.' })
  @IsEmail({}, { message: 'Activation email must be a valid email.' })
  public email: string;

  @IsOptional()
  @Equals(null, { message: 'Activation key must be null or undefined.' })
  public key: string;
}
