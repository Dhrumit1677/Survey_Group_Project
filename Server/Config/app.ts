import express, { NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createError from 'http-errors';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import passport from 'passport';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';

import * as DBConfig from './db';

import User from '../Models/user';

import authRouter from '../Routes/auth';
import indexRouter from '../Routes/index';
import surveyRouter from '../Routes/survey';
import questionRouter from '../Routes/question';
import takesurveyRouter from '../Routes/takesurvey';
import completedRouter from '../Routes/completed';


const app = express();

mongoose.connect(DBConfig.RemoteURI || DBConfig.LocalURI);

const db = mongoose.connection;

db.on("open", () => {
  console.log(`Connected to MongoDB at: ${(DBConfig.RemoteURI) ? DBConfig.HostName : "localhost"}`);
});

db.on("error", () => {
  console.error(`Connection Error`);
});


app.set('views', path.join(__dirname, '../Views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../Client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use(cors());

app.use(session({
  secret: DBConfig.Secret,
  saveUninitialized: false,
  resave: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add routing
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/survey', surveyRouter);
app.use('/survey/:sid/question', questionRouter);
app.use('/take-survey', takesurveyRouter);
app.use('/completed', completedRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: createError.HttpError, req: express.Request, res: express.Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
