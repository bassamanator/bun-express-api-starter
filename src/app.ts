import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';

import * as middlewares from './middleware';
import router from './router';

const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: '*', // NOTE Adjust to your needs
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.post('/profile', upload.single('avatar'), (req: express.Request, res: express.Response) => {
  console.log('req.file: ', req.file);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.sendStatus(200);
});

app.use('/api/v1', router());

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
