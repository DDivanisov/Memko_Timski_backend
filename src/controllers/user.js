const {httpStatus} = require('../config/http.config.js')
const {currentUserService} = require('../services/user.js')


const getCurrentUserController = async (req, res) => {
      const userId = req.user?._id;
      
      const {user} = await currentUserService(userId);

      return res.status(httpStatus.OK).json({
            message: "User fetched successfully",
            user
      });
}

module.exports = {getCurrentUserController};