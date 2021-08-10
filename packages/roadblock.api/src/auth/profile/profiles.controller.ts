import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { Request, Response } from 'express';
import { ZRuleBodyRequiresActivationEmail } from '../rules/rule-body-requires-activation-email.guard';
import { ZRuleBodyRequiresActivationKey } from '../rules/rule-body-requires-activation-key.guard';
import { ZRuleBodyRequiresUniqueUser } from '../rules/rule-body-requires-unique-user.guard';
import { ZRuleCookieRequiresAuthActivated } from '../rules/rule-cookie-requires-auth-activated.guard';
import { ZRuleCookieRequiresAuthAny } from '../rules/rule-cookie-requires-auth-any.guard';
import { ZRuleCookieRequiresAuthDeactivated } from '../rules/rule-cookie-requires-auth-deactivated.guard';
import { ZRuleCookieRequiresAuthRegular } from '../rules/rule-cookie-requires-auth-regular.guard';
import { ZTokensService } from '../tokens/tokens.service';
import { ZProfileActivationCreateDto } from './profile-activation-create.dto';
import { ZProfileActivationUpdateDto } from './profile-activation-update.dto';
import { ZProfileCreateDto } from './profile-create.dto';
import { ZProfileRecoveryCreateDto } from './profile-recovery-create.dto';
import { ZProfileUpdateDto } from './profile-update.dto';
import { ZProfilesService } from './profiles.service';

@Controller('profiles')
/**
 * Same as the users controller, but uses the cookie to get the id and has different permissions.
 *
 * Used by regular users to retrieve their own information.
 */
export class ZProfilesController {
  /**
   * Initializes a new instance of this object.
   *
   * @param _tokens The tokens service.
   * @param _profile The profile service.
   */
  public constructor(private readonly _tokens: ZTokensService, private readonly _profile: ZProfilesService) {}

  /**
   * Reads the user profile.
   *
   * @param req The request object.
   *
   * @returns The profile object given the requested cookie.
   */
  @Get()
  @UseGuards(ZRuleCookieRequiresAuthAny)
  public async read(@Req() req: Request): Promise<IZProfile> {
    const user = await this._tokens.extract(req);
    return new ZProfileBuilder().user(user).build();
  }

  /**
   * Updates the user profile.
   *
   * @param req The request object.
   * @param profile The profile data to update.
   *
   * @returns The updated user.
   */
  @Put()
  @UseGuards(ZRuleCookieRequiresAuthAny, ZRuleBodyRequiresUniqueUser)
  public async update(@Req() req: Request, @Body() profile: ZProfileUpdateDto): Promise<IZProfile> {
    const user = await this._tokens.extract(req);
    return this._profile.update(user, profile);
  }

  /**
   * Creates a new user.
   *
   * @param login The user to create.
   *
   * @returns A promise that, when resolved, has returned the new user.
   */
  @Post()
  @UseGuards(ZRuleBodyRequiresUniqueUser)
  public async create(@Body() login: ZProfileCreateDto): Promise<IZProfile> {
    return this._profile.create(login);
  }

  /**
   * Deletes the given user.
   *
   * @param req The request object.
   *
   * @returns The user that was deactivated/deleted.
   */
  @Delete()
  @UseGuards(ZRuleCookieRequiresAuthAny, ZRuleCookieRequiresAuthRegular, ZRuleCookieRequiresAuthActivated)
  public async remove(@Req() req: Request): Promise<IZProfile> {
    const user = await this._tokens.extract(req);
    return this._profile.remove(user);
  }

  /**
   * Activates the user.
   *
   * @param dto The user to activate.
   *
   * @returns The updated profile.
   */
  @Put('activations')
  @UseGuards(ZRuleCookieRequiresAuthAny, ZRuleCookieRequiresAuthDeactivated, ZRuleBodyRequiresActivationEmail, ZRuleBodyRequiresActivationKey)
  public async updateActivation(@Body() dto: ZProfileActivationUpdateDto): Promise<IZProfile> {
    return this._profile.activate(dto.email);
  }

  /**
   * Reactivates the user.
   *
   * @param dto The user to reactivate.
   *
   * @returns The updated profile.
   */
  @Post('activations')
  @UseGuards(ZRuleCookieRequiresAuthAny, ZRuleBodyRequiresActivationEmail)
  public async createActivation(@Body() dto: ZProfileActivationCreateDto): Promise<IZProfile> {
    return this._profile.reactivate(dto.email);
  }

  /**
   * Deactivates the user.
   *
   * @param req The request object.
   *
   * @returns The updated profile.
   */
  @Delete('activations')
  @UseGuards(ZRuleCookieRequiresAuthAny, ZRuleCookieRequiresAuthActivated, ZRuleCookieRequiresAuthRegular)
  public async deleteActivation(@Req() req: Request): Promise<IZProfile> {
    const user = await this._tokens.extract(req);
    return this._profile.deactivate(user.email);
  }

  /**
   * Creates a password recovery.
   *
   * @param dto The dto for the recovery.
   * @param res The response object.
   *
   * @returns The status returned will be a 204 regardless of whether a recovery email was sent.
   */
  @Post('recoveries')
  public async createPasswordRecovery(@Body() dto: ZProfileRecoveryCreateDto, @Res() res: Response): Promise<void> {
    await this._profile.recoverPassword(dto.email);
    res.sendStatus(204);
  }
}
