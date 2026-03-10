const {Router} = require('express');
const {createProjectController, getWorkspaceProjectsController, getProjcetController, getProjcetAnalyticsController, updateProjectController, deleteProjectController} = require('../controllers/project');


const projectRoutes =  Router();

projectRoutes.post(
      '/workspace/:workspaceId/create',
      createProjectController
)

projectRoutes.get(
      '/workspace/:workspaceId/all',
      getWorkspaceProjectsController
)

projectRoutes.get(
      '/:id/workspace/:workspaceId',
      getProjcetController
)

projectRoutes.get(
      "/:id/workspace/:workspaceId/analytics",
      getProjcetAnalyticsController
)

projectRoutes.put(
      '/:id/workspace/:workspaceId/update',
      updateProjectController
)

projectRoutes.delete(
      '/:id/workspace/:workspaceId/delete',
      deleteProjectController
)

module.exports = projectRoutes;