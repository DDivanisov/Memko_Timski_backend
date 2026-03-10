const { httpStatus } = require("../config/http.config")
const { AppError } = require("../utils/appError")


const isAuthenticated = (req, res, next) => {
      if(!req.user || !req.user._id){
            throw new AppError("Unauthorized. Please log in!", httpStatus.UNAUTHORIZED);
      }
      next();
}


module.exports = {isAuthenticated};