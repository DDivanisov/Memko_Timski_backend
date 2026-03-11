const { config } = require('../config/app.config');
const { registrationSchema, loginSchema } = require('../validation/auth.js');
const { httpStatus} = require('../config/http.config.js');
const { registerService } = require('../services/auth.js');
const passport = require('passport');

const googleLoginController = async (req, res) => {

    const workSpace = await req.user.currentWorkSpace;
    console.log(workSpace);
    if(!workSpace){
        console.log("redirect to login failed");
      return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failed_no_workspace`);
    }
    console.log("redirected to login success");
    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${workSpace}`);
};

const registerController = async (req, res) => {

    const result = registrationSchema.safeParse(req.body);
    if(!result.success){
        throw result.error;
    }    
    await registerService(result.data);
    
    return res.status(httpStatus.CREATED).json({
        message: "User registered successfully",
    });

};

const loginController = async (req, res, next) => {
    passport.authenticate(
        "local",
        (
            err,
            user,
            info
        ) => {
            if(err){
                return next(err);
            }
            if(!user){
                return res.status(httpStatus.UNAUTHORIZED).json({
                    message: "Invalid email or password"
                });
            }
            req.logIn(user, (err)=>{
                if(err){
                    return next(err);
                }
                return res.status(httpStatus.OK).json({
                    message: "Loged in successfully",
                    user
                });
            })
        }
    )(req, res, next);
};

const logoutController = async (req, res) => {
    req.logout((err) => {
        if(err){
            console.log("Log out error:" + err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Failed log out"
            });
        }

        req.session.destroy((err) => {
            if (err) {
            return next(err);}
        });
        res.clearCookie('connect.sid');
        return res.status(httpStatus.OK).json({
            message: "Succesfuly logged out."
        });

    });

};

module.exports = {
    googleLoginController,
    registerController,
    loginController,
    logoutController
};