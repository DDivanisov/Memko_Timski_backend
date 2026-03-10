const {Router} = require('express')
const {createTaskController, updateTaskController, getAllTasksController, getTaskByIdController, deleteTaskController, predictTaskType, predictTaskPriority} = require('../controllers/task');

const taskRoutes = Router();


taskRoutes.post(
      '/predict/type',
      predictTaskType
);

taskRoutes.post(
      '/predict/priority',
      predictTaskPriority
);

taskRoutes.post(
      '/project/:projectId/workspace/:workspaceId/create',
      createTaskController
)

taskRoutes.put(
      '/:id/project/:projectId/workspace/:workspaceId/update',
      updateTaskController
)

taskRoutes.get(
      "/workspace/:workspaceId/all",
       getAllTasksController
)

taskRoutes.get(
      "/:id/project/:projectId/workspace/:workspaceId",
      getTaskByIdController
);

taskRoutes.delete(
      "/:id/workspace/:workspaceId/delete", 
      deleteTaskController
);
module.exports = taskRoutes;