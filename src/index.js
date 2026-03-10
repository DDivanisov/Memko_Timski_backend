const express = require('express');
const session = require('express-session');
const passport = require('passport');
const corse = require('cors');

const { connectDatabase } = require('./config/database.config');
const { config } = require('./config/app.config');

const { errorHandler } = require('./middlewares/errorHandler');
const { isAuthenticated} = require('./middlewares/authenticated.js');
const { httpStatus } = require('./config/http.config');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user.js');
const workspaceRouter = require('./routes/workspace.js');
const memberRouter = require('./routes/member.js');
const projectRouter = require('./routes/project.js');
const taskRouter = require('./routes/task.js');


require('./config/passport.config.js');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie:{
        maxAge: parseInt(config.SESSION_EXPIRES_IN_HOURES) * 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
      },
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(
    corse({
        origin: config.FRONTEND_ORIGIN,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);
   
const baseUrl = config.BASE_PATH;

app.get(`/${baseUrl}/ping`, async (req, res) => {
  
  res.status(httpStatus.OK).json({
      message: 'Server is up and running!',
    }
  );
});

app.get(`/${baseUrl}/`, async (req, res) => {
  res.status(httpStatus.OK).json({
      message: 'Welcome to the API!',
    }
  );
});


app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/user`,isAuthenticated, userRouter);
app.use(`${baseUrl}/workspace`,isAuthenticated ,workspaceRouter);
app.use(`${baseUrl}/member`, isAuthenticated, memberRouter);
app.use(`${baseUrl}/project`, isAuthenticated, projectRouter);
app.use(`${baseUrl}/task`, isAuthenticated, taskRouter);


// Global Error Handler Middleware
app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
  await connectDatabase();
});