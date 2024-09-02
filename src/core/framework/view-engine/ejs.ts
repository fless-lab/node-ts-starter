import express from 'express';
import path from 'path';

export default (app: express.Application): void => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../../../../views'));
  app.use(express.static(path.join(__dirname, '../../../../public')));
};
