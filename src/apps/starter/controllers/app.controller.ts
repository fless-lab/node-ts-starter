/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { listRoutes } from '../../../helpers';
import { ViewService } from '../../../common/shared';

class AppController {
  static async showHomePage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const viewService = new ViewService();
      const routes = listRoutes(req.app);
      req.flash('error', 'Error msg sample : une erreur est survenue.');
      req.flash('success', 'Success msg sample : Successfully added.');
      viewService.renderPage(req, res, 'index', { routes });
    } catch (error) {
      const viewService = new ViewService();
      viewService.renderErrorPage(req, res, 500, 'Internal Server Error');
    }
  }
}

export default AppController;
