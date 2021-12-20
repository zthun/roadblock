import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { IZProfileActivation, ZAssert } from '@zthun/works.core';
import { ZSecurityService } from '@zthun/works.nest';
import { Request } from 'express';

@Injectable()
/**
 * Represents a rule that states that a request body must be an IZProfileActivation object and
 */
export class ZRuleBodyRequiresActivationEmail implements CanActivate {
  /**
   * Initializes a new instance of this object.
   *
   * @param _security The service for extracting the auth token.
   */
  public constructor(private readonly _security: ZSecurityService) {}

  /**
   * Gets whether or not the http request can be executed.
   *
   * @param context The context that contains the http request to check.
   *
   * @returns A promise that resolves to true if the route can run.  Returns a rejected promise if
   *          the user is trying to activate another user.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const activation = request.body as IZProfileActivation;
    const user = await this._security.extract(request);

    ZAssert.claim(user.email === activation.email, 'You cannot activate another user.').assert((msg) => new ForbiddenException(msg));

    return true;
  }
}
