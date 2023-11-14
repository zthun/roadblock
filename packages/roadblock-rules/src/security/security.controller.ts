import { Controller, Get, Req, Res } from '@nestjs/common';
import { ZHttpCodeSuccess } from '@zthun/webigail-http';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { Request, Response } from 'express';
import { ZSecurityService } from './security.service';

@Controller('identity')
/**
 * The security controller adds the /identity route.
 *
 * The /identity route is the secure way to read the existing cookie.
 */
export class ZSecurityController {
  /**
   * Initializes a new instance of this object.
   *
   * @param _security The security service.
   * @param _profile The profile service.
   */
  public constructor(private readonly _security: ZSecurityService) {}

  /**
   * Reads the user profile from the cookie.
   *
   * @param req The request object.
   * @param res The response object.
   *
   * @returns The profile object given the requested cookie.
   */
  @Get()
  public async read(@Req() req: Request, @Res() res: Response): Promise<IZProfile | null> {
    const user = await this._security.extract(req);

    if (user == null) {
      res.status(ZHttpCodeSuccess.NoContent).send(null);
      return null;
    }

    const profile = new ZProfileBuilder().user(user).build();
    res.status(ZHttpCodeSuccess.OK).send(profile);
    return profile;
  }
}
