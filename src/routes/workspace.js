const { Router } = require("express");
const {
      createWorkSpaceController, getUserWorkSpacesController, getWorkSpaceController, getMembersInWorkSpaceController,
      getWorkspaceAnalyticsController, changeWorkspaceMemberRoleController, updateWorkSpaceController, deleteWorkSpaceController
} = require('../controllers/workspace.js')


const WorkSpaceRoute = Router()

WorkSpaceRoute.post(
      '/create/new',
      createWorkSpaceController
);


WorkSpaceRoute.get(
      '/all',
      getUserWorkSpacesController
);

WorkSpaceRoute.get(
      '/:id',
      getWorkSpaceController
);

WorkSpaceRoute.get(
      '/members/:id',
      getMembersInWorkSpaceController
);


WorkSpaceRoute.get(
      '/analytics/:id',
      getWorkspaceAnalyticsController

)

WorkSpaceRoute.put(
      '/change/member/role/:id', 
      changeWorkspaceMemberRoleController
)


WorkSpaceRoute.put(
      '/update/:id',
      updateWorkSpaceController
)

WorkSpaceRoute.delete(
      '/delete/:id',
      deleteWorkSpaceController
)

module.exports = WorkSpaceRoute;