const { httpStatus } = require('../config/http.config.js');
const { isUserMemberService } = require('../services/member.js');
const {projectIdSchema} = require('../validation/project.js');
const {idWorkSpaceSchema} = require('../validation/workspace.js');
const {createTaskSchema, updateTaskSchema, TaskIdSchema} = require('../validation/task.js');
const {roleGuard} = require('../utils/roleGuard.js');
const {createTaskService, updateTaskService, deleteTaskService, getAllTasksService, getTaskByIdService, predictTaskTypeService, predictTaskPriorityService} = require('../services/task.js');

const createTaskController = async (req, res) => {
      const result = updateTaskSchema.parse(req.body);
      const projectId = projectIdSchema.parse(req.params.projectId);
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);

      const userId = req.user._id;  

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "CREATE_TASK");
      const {task} = await createTaskService(workspaceId, projectId, userId, result);

      return res.status(httpStatus.CREATED).json({
            message: "Task created successfully.",
            task
      });
}

const predictTaskType = async (req, res) => {
    const {description} = req.body;
    const {prediction} = await predictTaskTypeService(description);
    
    return res.status(httpStatus.OK).json({
        message: "Task tpe succesfully predicted.",
        prediction
    })
}

const predictTaskPriority = async (req, res) => {
    const {description} = req.body;
    const {prediction} = await predictTaskPriorityService(description);
    
    return res.status(httpStatus.OK).json({
        message: "Task tpe succesfully predicted.",
        prediction
    })
}


const updateTaskController = async(req, res) => {
      const result = createTaskSchema.parse(req.body);
      const projectId = projectIdSchema.parse(req.params.projectId);
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const taskId = TaskIdSchema.parse(req.params.id);

      const userId = req.user._id;  

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "EDIT_TASK");
      const {updateTask} = await updateTaskService(taskId, projectId, workspaceId, userId, result);

      return res.status(httpStatus.OK).json({
            message: "Task update successfully",
            updateTask
      })
}

const getTaskByIdController = async (req, res) => {
    const userId = req.user?._id;

    const taskId = TaskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);

    const { role } = await isUserMemberService(userId, workspaceId);

    const {task} = await getTaskByIdService(workspaceId, projectId, taskId);

    return res.status(httpStatus.OK).json({
      message: "Task fetched successfully",
      task,
    });
}


const  deleteTaskController = async (req, res) => {
    const userId = req.user?._id;

    const taskId = TaskIdSchema.parse(req.params.id);
    const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);

    const { role } = await isUserMemberService(userId, workspaceId);

    await deleteTaskService(workspaceId, taskId);

    return res.status(httpStatus.OK).json({
      message: "Task deleted successfully",
    });
}

const getAllTasksController = async (req, res) => {
    const userId = req.user?._id;

    const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);

    const filters = {
      projectId: req.query.projectId,
      status: req.query.status ? req.query.status.split(",") : undefined,
      priority: req.query.priority ? req.query.priority.split(',') : undefined,
      type: req.query.type ? req.query.type.split(',') : undefined,
      assignedTo: req.query.assignedTo ? req.query.assignedTo.split(',') : undefined,
      keyword: req.query.keyword,
      dueDate: req.query.dueDate
    }; 

    const pagination = {
      pageSize: parseInt(req.query.pageSize) || 10,
      pageNumber: parseInt(req.query.pageNumber) || 1
    }

    const {role} = await isUserMemberService(userId, workspaceId);
    roleGuard(role, 'DELETE_TASK');
    const results = await getAllTasksService(workspaceId, filters, pagination);

    return res.status(httpStatus.OK).json({
      message: "Tasks fetched",
      ...results
    });


}
module.exports = {createTaskController, updateTaskController, getTaskByIdController, deleteTaskController, getAllTasksController, predictTaskType, predictTaskPriority}