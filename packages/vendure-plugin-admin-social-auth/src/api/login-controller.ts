import { Controller, Get, Inject, Res } from '@nestjs/common';
import {
  ConfigService,
  VENDURE_VERSION,
  Injector
} from '@vendure/core';
import { Response } from 'express';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { AdminSocialAuthPluginOptions } from '../admin-social-auth.plugin';
import { AdminUiConfig } from '@vendure/common/lib/shared-types';
import { ModuleRef } from '@nestjs/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';

/**
 * Custom login page
 */
@Controller()
export class LoginController {

  private readonly injector: Injector;

constructor(
    @Inject(PLUGIN_INIT_OPTIONS) private readonly options: AdminSocialAuthPluginOptions,
    private configService: ConfigService,
    private moduleRef: ModuleRef,
    ) { 
      this.injector = new Injector(this.moduleRef);
    }

  @Get('social-auth/login')
  async getLogin(
    @Res() res: Response,
  ): Promise<void> {
    const adminUiPlugin = this.injector.get(AdminUiPlugin);
    // Dirty hack to get the private static adminUiConfig
    const adminUiConfig: Partial<AdminUiConfig> | undefined  =  (AdminUiPlugin as any).options?.adminUiConfig;
    const loginHtml = await fs.readFile(`${__dirname}/../ui/login.html`, 'utf8');
    const rendered = Handlebars.compile(loginHtml)({ 
      clientId: this.options.google?.oAuthClientId,
      version: VENDURE_VERSION,
      brand: adminUiConfig?.brand,
      hideVendureBranding: adminUiConfig?.hideVendureBranding,
      hideVersion: adminUiConfig?.hideVersion,
    });
    res.send(rendered);
  }
}