import { Application } from 'express';
import { config } from '../../config';
import { logger } from '../../../common/shared';

const initializeViewEngine = async (app: Application): Promise<void> => {
  const viewEngine = config.defaultViewEngine;

  if (!config.viewEngines.includes(viewEngine)) {
    throw new Error(
      `View engine ${viewEngine} is not supported. Please choose one of the following: ${config.viewEngines.join(', ')}.`,
    );
  }

  try {
    const viewEngineModule = await import(`./${viewEngine}`);
    viewEngineModule.default(app);
    logger.info(`${viewEngine} view engine initialized.`);
  } catch (error) {
    logger.error(
      `Failed to initialize ${viewEngine} view engine.`,
      error as Error,
    );
    throw new Error(`View engine ${viewEngine} not supported.`);
  }
};

export default initializeViewEngine;
