import { Application } from 'express';
import { config } from '../../config';

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
    console.log(`${viewEngine} view engine initialized.`);
  } catch (error) {
    console.error(`Failed to initialize ${viewEngine} view engine.`, error);
    throw new Error(`View engine ${viewEngine} not supported.`);
  }
};

export default initializeViewEngine;
