const { httpStatus } = require("../config/http.config");
const { MemberModel } = require("../models/member");
const { RoleModel } = require("../models/role-permission");
const { UserModel } = require("../models/user");
const { WorkspaceModel } = require("../models/workspace");
const { TaskModel } = require("../models/task");
const {ProjectModel} = require("../models/project");
const { AppError } = require("../utils/appError");
const mongoose = require("mongoose");


const createWorkSpaceService = async(userId,data)=>{
      const user = await UserModel.findById(userId);
      if(!user){
            throw new AppError("User not found.", httpStatus.NOT_FOUND);
      }

      const ownerRole = await RoleModel.findOne({name: "Owner"});

      const workspace = new WorkspaceModel({
            name: data.name,
            description: data.description,
            owner: user._id
      });

      await workspace.save();

      const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date()
      });

      await member.save();
      user.currentWorkSpace = workspace._id;
      await user.save();

      return {workspace};
};

const getUserWorkSpacesService = async(userId) => {
      
      const membership = await MemberModel.find({userId}).populate('workspaceId').select('-password').exec();

      const workspaces = membership.map((membership) => membership.workspaceId);

      return {workspaces};
}

const getWorkSpaceService = async(workspaceId) =>{
      const workspace = await WorkspaceModel.findById(workspaceId);
      const members = await MemberModel.find({workspaceId}).populate('role');

      const fullworkspace = {
            ...workspace.toObject(),
            members
      }
      return {workspace: fullworkspace};
}


const getMembersinWorkSpaceService = async(workspaceId) => {
      
      const members = await MemberModel.find({workspaceId}).populate('userId', "name email profilePicture -password").populate('role', 'name');


      
      const roles = await RoleModel.find({}, {name:1, _id:1}).select("-permission").lean();

      return {members, roles}
}


const getWorkspaceAnalyticsService = async(workspaceId) => {
      const currDate = new Date();

      const totalTasks =  await TaskModel.countDocuments({workspace: workspaceId});

      const overdueTasks = await TaskModel.countDocuments({workspace: workspaceId, dueDate: {$lt: currDate}, status: {$ne: "Done"}});

      const completedTasks = await TaskModel.countDocuments({workspace: workspaceId, status: "Done"});

      const analytics = {
            totalTasks,
            overdueTasks,
            completedTasks
      }

      return {analytics};

}

const changeWorkspaceMemberRoleService = async(workspaceId, memberId, roleId) =>{
      const role = await RoleModel.findById(roleId);
      if(!role){
            throw new AppError("Role none existant.", httpStatus.NOT_FOUND);
      }
      
      const workspace = await WorkspaceModel.findById(workspaceId);
      if(!workspace){
            throw new AppError("Workspace none existant", httpStatus.NOT_FOUND)
      }

      const member = await MemberModel.findOne({
            userId: memberId,
            workspaceId: workspaceId
      });

      if(!member){
            throw new AppError("Member is not found in this workspace", httpStatus.NOT_FOUND)
      }

      member.role = role;
      await member.save();

      return {member};
}

const updateWorkSpaceService = async (workspaceId, name, description)=>{
      const workspace = await WorkspaceModel.findById(workspaceId);
      if(!workspace){
            throw new AppError("Workspace none existant", httpStatus.NOT_FOUND);
      }
      workspace.description = description; 
      workspace.name = name;
      await workspace.save();
      return {workspace};
}

const deleteWorkSpaceService = async (workspaceId, userId) =>{

      const session = await mongoose.startSession();
      session.startTransaction();

      try{
            const workspace = await WorkspaceModel.findById(workspaceId).session(session);
            if(!workspace){
                  throw new AppError("Workspace none existant", httpStatus.NOT_FOUND);
            }

            const user = await UserModel.findById(userId).session(session);
            if(!user){
                  throw new AppError("User not found", httpStatus.NOT_FOUND);
            }

            await ProjectModel.deleteMany({workspace: workspaceId}).session(session);
            await TaskModel.deleteMany({workspace: workspaceId}).session(session);
            await MemberModel.deleteMany({workspaceId: workspaceId}).session(session);

            if(user.currentWorkSpace.equals(workspaceId)){
                  const memberWorkspace = await MemberModel.findOne({userId: userId}).session(session);

                  user.currentWorkSpace = memberWorkspace ? memberWorkspace.workspaceId : null;

                  await user.save({session});
            }
            await workspace.deleteOne({session});

            await session.commitTransaction();

            session.endSession();   
            return {
                  currentWorkspace: user.currentWorkSpace
            };

      }
      catch(err){
            await session.abortTransaction();
            session.endSession();
            throw err;
      }

}

module.exports = {
      createWorkSpaceService, getUserWorkSpacesService, getWorkSpaceService, getMembersinWorkSpaceService, 
      getWorkspaceAnalyticsService, changeWorkspaceMemberRoleService, updateWorkSpaceService, deleteWorkSpaceService
}