import express from 'express';
import path from 'path';

export default (app: express.Application): void => {
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../../../../views'));
  app.use(express.static(path.join(__dirname, '../../../../views')));
};
