const passport = require('passport');
const { config } = require('./app.config');
const { loginOrCreateAccountService, loginService } = require('../services/auth');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: LocalStrategy } = require('passport-local');
const { UserModel } = require('../models/user.js');

const {AppError} = require('../utils/appError.js');

passport.use( 
  new GoogleStrategy(
  {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true,
  },
   async (req, accessToken, refreshToken, profile, done) => {
    
      try{
            const { email, sub: googleId, picture} = profile._json;

            if(!googleId){
                  throw new AppError('Google ID not found in profile', 404);
            }
            const {user} = await loginOrCreateAccountService({
                  provider: 'google',
                  providerId: googleId,
                  displayName: profile.displayName,
                  email: email,
                  avatarUrl: picture,
            });
            done(null, user);
      }
      catch(err){
            done(err, false);
      }
  }
));



passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true
    },
    async (email, password, done) => {
      try{
        const user = await loginService(email, password, 'Email');
        done(null, user);
      }
      catch(err){
         done(err, false)
      }
    }

  ));

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id)
    done(null, user)
  } catch(err) {
    done(err, null)
  }
})