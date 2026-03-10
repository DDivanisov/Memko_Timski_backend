const { httpStatus } = require('../config/http.config.js');
const {UserModel} = require('../models/user.js');
const {AppError} = require('../utils/appError.js')

const currentUserService = async (userId) => {
      
      const user = await UserModel.findById(userId).populate("currentWorkSpace").select("-password");
      
      if(!user){
            throw new AppError("User not logged in!", httpStatus.UNAUTHORIZED);
      }

      return {user};
};


module.exports = {currentUserService};