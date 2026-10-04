import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import type { IZProfileActivation } from "@zthun/works.core";
import { ZAssert } from "@zthun/works.core";
import type { ZSecurityService } from "@zthun/works.nest";
import type { Request } from "express";

@Injectable()
/**
 * Represents a rule that states that a request body must be an IZProfileActivation object and the activator key
 * must match
 */
export class ZRuleBodyRequiresActivationKey implements CanActivate {
  /**
   * Initializes a new instance of this object.
   *
   * @param _security The service to extract the auth token.
   */
  public constructor(private readonly _security: ZSecurityService) {}

  /**
   * Gets whether the http request can continue.
   *
   * @param context The context that contains the http request.
   *
   * @returns A promise that resolves to true if the http request can continue.  Returns a rejected promise if the activation key
   *          has expired or it does not match.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const activation = request.body as IZProfileActivation;
    const user = await this._security.extract(request);
    const tick = new Date().getTime();

    ZAssert.claim(
      user.activator.exp > tick,
      "The activation key has expired.  Please send yourself another activation key.",
    )
      .claim(
        user.activator.key === activation.key,
        "The activation key does not match.  Please try again or send yourself another activation key.",
      )
      .assert((msg) => new ForbiddenException(msg));

    return true;
  }
}
