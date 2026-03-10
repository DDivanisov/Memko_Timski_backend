const express = require('express');
const passport = require('passport');
const {config} = require('../config/app.config');
const { googleLoginController, registerController, loginController, logoutController } = require('../controllers/auth.js');

const authRouter = express.Router();

authRouter.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
      "/google/callback",
      passport.authenticate("google", {
            failureRedirect: `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`,
      }),
      googleLoginController
);

authRouter.post(
      '/register',
      registerController
);   

authRouter.post(
      '/login',
      loginController
);

authRouter.post(
      '/logout',
      logoutController
);
module.exports = authRouter;