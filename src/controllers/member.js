const { httpStatus } = require('../config/http.config');
const {joinWorkspaceService} = require('../services/member');
const {z} = require('zod');

const joinWorkspaceController = async (req, res) => {
      const inviteCode = z.string().parse(req.params.inviteCode);
      const userId = req.user._id;

      const {workspaceId, role} = await joinWorkspaceService(userId, inviteCode);
      return res.status(httpStatus.OK).json({
            message: "Successfully joined workspace",
            workspaceId,
            role
      }); 
}


module.exports = {joinWorkspaceController}