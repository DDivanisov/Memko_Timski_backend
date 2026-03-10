const { httpStatus } = require("../config/http.config");
const { ProjectModel } = require("../models/project");
const {TaskModel} = require('../models/task');
const { AppError } = require("../utils/appError");


const createProjectService = async (userId, workspaceId, body) => {
      const project = new ProjectModel({
            emoji: body.emoji,
            name: body.name,
            description: body.description,
            workspace: workspaceId,
            createdBy: userId
      });

      await project.save();
      return {project};
}

const getWorkspaceProjectsService = async (workspaceId, pageNumber, pageSize) => {
      const totalCount = await ProjectModel.countDocuments({
            workspace: workspaceId
      });

      const skip = (pageNumber - 1) * pageSize;

      const projects = await ProjectModel.find({
            workspace: workspaceId
      }).skip(skip).limit(pageSize).populate('createdBy','_id name profilePicture -password').sort({createdAt: -1});

      const totalPages = Math.ceil(totalCount/pageSize);

      return {projects, totalCount, totalPages, skip};

}

const getProjcetService = async (projectId, workspaceId) => {
      const project  = await ProjectModel.find({
            _id:projectId,
            workspace: workspaceId
      }).select("_id name description emoji");
      if(!project){
            throw new AppError("Project non existant.", httpStatus.NOT_FOUND);
      }
      return {project};
}

const getProjectAnalyticsService = async (workspaceId, projectId) => {
      const currDate = new Date();

      const totalTasks =  await TaskModel.countDocuments({workspace: workspaceId, project: projectId});

      const overdueTasks = await TaskModel.countDocuments({workspace: workspaceId, project: projectId, dueDate: {$lt: currDate}, status: {$ne: "Done"}});

      const completedTasks = await TaskModel.countDocuments({workspace: workspaceId, project: projectId, status: "Done"});

      
      const analytics = {
            totalTasks,
            overdueTasks,
            completedTasks
      }
      return {analytics};
}

const updateProjectService = async (workspaceId, projectId, body) => {
      const project = await ProjectModel.findOne({
            _id: projectId,
            workspace: workspaceId
      });
      if(!project){
            throw new AppError("Project non existant or is not part of this workspace", httpStatus.NOT_FOUND);
      }

      if(body.emoji) project.emoji = body.emoji
      if(body.name) project.name = body.name
      if(body.description) project.description = body.description

      await project.save();

      return {project};


}


const deleteProjectService = async (workspaceId, projectId) => {
      const project = await ProjectModel.findOne({
            _id: projectId,
            workspace: workspaceId
      });
      if(!project){
            throw new AppError("Project non existant or is not part of this workspace", httpStatus.NOT_FOUND);
      }

      await TaskModel.deleteMany({
            project: project._id
      })

      await project.deleteOne();

      return {project};
}

module.exports = {createProjectService, getWorkspaceProjectsService, getProjcetService, getProjectAnalyticsService, updateProjectService, deleteProjectService}