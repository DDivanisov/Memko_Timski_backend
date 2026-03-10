const { describe } = require("zod/v4/core");
const { httpStatus } = require("../config/http.config");
const { MemberModel } = require("../models/member");
const { ProjectModel } = require("../models/project");
const {TaskModel} = require('../models/task');
const { AppError } = require("../utils/appError");
const {predict_issue_type, predict_priority_type} = require("../utils/prediction");

const createTaskService = async (workspaceId, projectId,userId, body) => {
      const project = await ProjectModel.findById(projectId);
      if(!project || project.workspace.toString() != workspaceId.toString()){
            throw new AppError("Project non existant or is not part of this workspace.", httpStatus.NOT_FOUND);
      }

      if(body.assignedTo){
            const isAssignedUserMember = await MemberModel.exists({
                  userId: userId,
                  workspaceId: workspaceId
            });
            if(!isAssignedUserMember){
                  throw new AppError("Can not assigne task, user is not a part of this workspace.", httpStatus.BAD_REQUEST);
            }
      }
      const task = new TaskModel({
            title: body.title,
            description: body.description,
            priority: body.priority,
            type: body.type,
            dueDate: body.dueDate,
            status: body.status,
            assignedTo: body.assignedTo,
            project: projectId,
            createdBy: userId,
            workspace: workspaceId
      });

      await task.save();
      return {task};
}

const predictTaskTypeService = async (description) => {
      let {prediction, confidence} = await predict_issue_type(description);
      return {prediction};
}

const predictTaskPriorityService = async (description) => {
      let {prediction, confidence} = await predict_priority_type(description);
      return {prediction};
}

const updateTaskService = async (taskId, projectId, workspaceId, userId, body )  => {
      const project = await ProjectModel.findById(projectId);
      if(!project || project.workspace.toString() != workspaceId.toString()){
            throw new AppError("Project non existant or is not part of this workspace.", httpStatus.NOT_FOUND);
      }

      const task = await TaskModel.findById(taskId);
      if(!task || task.project.toString() != projectId.toString()){
            throw new AppError("Task non existant or is not part of this project.", httpStatus.NOT_FOUND);
      }

      if(body.assignedTo){
            const isAssignedUserMember = await MemberModel.exists({
                  userId: userId,
                  workspaceId: workspaceId
            });
            if(!isAssignedUserMember){
                  throw new AppError("Can not assigne task, user is not a part of this workspace.", httpStatus.BAD_REQUEST);
            }
      }
      
      const updateTask = await TaskModel.findByIdAndUpdate(taskId,
            {
                  ...body
            },
            {new: true}
      )
      if(!updateTask){
            throw new AppError("Task failed to update.", httpStatus.BAD_REQUEST);
      }
      return {updateTask};
}

const deleteTaskService = async(workspaceId, taskId) => {
      const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new AppError(
      "Task not found or does not belong to the specified workspace",httpStatus.NOT_FOUND
    );
  }

  return;
}

const getAllTasksService = async(workspaceId, filters, pagination) => {

      const query = {
            workspace: workspaceId
      };

      if(filters.projectId) {query.project = filters.projectId;}
      if(filters.status && filters.status.length > 0) {query.status = {$in: filters.status};}
      if(filters.assignedTo && filters.assignedTo.length > 0) {query.assignedTo = {$in: filters.assignedTo};}
      if(filters.type && filters.type.length > 0) {query.type = {$in: filters.type};}
      if(filters.priority && filters.priority.length > 0){ query.priority = {$in: filters.priority};}
      if(filters.keyword !== undefined) {query.title = { $regex: filters.keyword, $options: "i" };}
      if(filters.dueDate) {query.dueDate = {$eq: new Date(filters.dueDate)}}

      const skip = (pagination.pageNumber - 1) * pagination.pageSize;

      const [tasks, totalCount] = await Promise.all([
            TaskModel.find(query).skip(skip).limit(pagination.pageSize).sort({createdAt: -1})
            .populate("assignedTo", "_id name profilePicture -password")
            .populate("project", "_id emoji name"),
            TaskModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / pagination.pageSize);
      const pageSize = pagination.pageSize;
      const pageNumber = pagination.pageNumber;
      return {
            tasks,
            pagination: {
                  pageSize,
                  pageNumber,
                  totalCount,
                  totalPages,
                  skip,
            },
      };

}

const getTaskByIdService = async(workspaceId, projectId, taskId) => {
      const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new AppError(
      "Project not found or does not belong to this workspace",
      httpStatus.NOT_FOUND
    );
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new AppError("Task not found.", httpStatus.NOT_FOUND);
  }

  return {task};
}

module.exports = { createTaskService, updateTaskService, deleteTaskService, getAllTasksService, getTaskByIdService, predictTaskTypeService, predictTaskPriorityService}