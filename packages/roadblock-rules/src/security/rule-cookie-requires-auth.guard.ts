import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IZUser } from '@zthun/works.core';
import { Request } from 'express';
import { ZSecurityService } from './security.service';

@Injectable()
/**
 * An abstract implementation of a rule that makes a claim based on the current authenticated state of the auth cookie.
 */
export abstract class ZRuleCookieRequiresAuth implements CanActivate {
  /**
   * Initializes a new instance of this object.
   */
  public constructor(private _security: ZSecurityService) {}

  /**
   * Gets whether or not the request can continue.
   *
   * @param context The context that contains the http request.
   *
   * @returns A promise that resolves to true if all claims pass.  Returns a rejected promise
   *          if the claim throws an exception.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = await this._security.extract(request);
    this.claim(user);
    return true;
  }

  /**
   * Invokes all claims against the user represented by the request cookie.
   *
   * @param user The user to check.
   *
   * @throws HttpException if any claims fail.
   */
  public abstract claim(user: IZUser | null): void;
}
