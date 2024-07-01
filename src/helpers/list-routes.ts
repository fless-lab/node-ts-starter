import { Application } from 'express';
import expressListEndpoints from 'express-list-endpoints';

function listRoutes(app: Application) {
  const routes = expressListEndpoints(app);
  return routes.map((route) => ({
    path: route.path,
    methods: route.methods,
    middlewares: route.middlewares,
  }));
}

export { listRoutes };
