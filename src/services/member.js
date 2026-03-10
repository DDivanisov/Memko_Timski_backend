const { httpStatus } = require('../config/http.config.js');
const { MemberModel } = require('../models/member.js');
const { RoleModel } = require('../models/role-permission.js');
const { WorkspaceModel } = require('../models/workspace.js');
const { AppError } = require("../utils/appError");

const isUserMemberService = async(userId, workspaceId) => {
      const workspace = await WorkspaceModel.findById(workspaceId);
      if(!workspace){
            throw new AppError("Workspace not found", httpStatus.NOT_FOUND);
      }
      const member = await MemberModel.findOne({userId, workspaceId}).populate("role");
      if(!member){
            throw new AudioParamMap("You are not a member of this workspace", httpStatus.UNAUTHORIZED);
      }
      const rolename = member.role.name;
      return {role: rolename};
}


const joinWorkspaceService = async(userId, inviteCode) => {
      const workspace = await WorkspaceModel.findOne({inviteCode});
      if(!workspace){
            throw new AppError("Invalid invite code or workspace",httpStatus.NOT_FOUND);
      }

      const existingMember = await MemberModel.findOne({
            userId: userId,
            workspaceId: workspace._id
      }).exec();

      if(existingMember){
            throw new AppError("You are already a member of this workspace", httpStatus.BAD_REQUEST);
      }

      const role = await RoleModel.findOne({name:"Member"});
      
      const newMember = new MemberModel({
            userId: userId,
            workspaceId: workspace._id,
            role: role._id
      })
      await newMember.save();


      return {workspaceId: workspace._id, role: role.name};
}
module.exports = { isUserMemberService, joinWorkspaceService };