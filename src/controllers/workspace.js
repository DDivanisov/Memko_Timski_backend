const { httpStatus } = require('../config/http.config.js');

const {
      createWorkSpaceService, getUserWorkSpacesService, getWorkSpaceService, getMembersinWorkSpaceService,  
      getWorkspaceAnalyticsService, changeWorkspaceMemberRoleService, updateWorkSpaceService, deleteWorkSpaceService
} = require('../services/workspace.js');
const { isUserMemberService } = require('../services/member.js');
const {createWorkSpaceSchema, updateWorkSpaceSchema, idWorkSpaceSchema, changeRoleSchema} = require('../validation/workspace.js');
const { roleGuard } = require('../utils/roleGuard.js');

const createWorkSpaceController = async(req, res) => {
      const result = createWorkSpaceSchema.parse(req.body);

      const userId = req.user._id;
      const {workspace} = await createWorkSpaceService(userId, result);

      return res.status(httpStatus.CREATED).json({
            message: "Workspace created successfully",
            workspace
      });
}

const getUserWorkSpacesController = async (req, res) => {
      const userId = req.user._id;
      const {workspaces} = await getUserWorkSpacesService(userId);
      return res.status(httpStatus.OK).json({
            message: "User workspaces fetched successfully",
            workspaces
      })
}

const getWorkSpaceController = async(req, res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.id);
      const userId = req.user._id;

      await isUserMemberService(userId, workspaceId);

      const {workspace} = await getWorkSpaceService(workspaceId);

      return res.status(httpStatus.OK).json({
            message: "Workspace successfully fetched.",
            workspace
      });
}

const getMembersInWorkSpaceController = async (req, res) =>{
      const workspaceId = idWorkSpaceSchema.parse(req.params.id);
      const userId = req.user._id;

      
      const {role} = await isUserMemberService(userId, workspaceId);


      const {members, roles} = await getMembersinWorkSpaceService(workspaceId);
      
      return res.status(httpStatus.OK).json({
            message: "Workspace members retrived successfully",
            members,
            roles
      });

}

const getWorkspaceAnalyticsController = async (req, res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.id);
      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);
      
      const {analytics} = await getWorkspaceAnalyticsService(workspaceId);

      return res.status(httpStatus.OK).json({
            message: "Analytics fetched successfully",
            analytics
      })
}

const changeWorkspaceMemberRoleController = async (req, res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.id);
      const userId = req.user._id;
      const {memberId, roleId} = changeRoleSchema.parse(req.body);

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "CHANGE_MEMBER_ROLE");

      const {member} = await changeWorkspaceMemberRoleService(workspaceId, memberId, roleId);

      return res.status(httpStatus.OK).json({
            message: "Member role changed successfully",
            member
      })

}

const updateWorkSpaceController = async (req, res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.id);
      const userId = req.user._id;

      const result = updateWorkSpaceSchema.parse(req.body);

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "EDIT_WORKSPACE");

      const {workspace} = await updateWorkSpaceService(workspaceId, result.name, result.description);

      return res.status(httpStatus.OK).json({
            message: "Updated workspce successfully",
            workspace
      })

}

const deleteWorkSpaceController = async (req, res) =>{
      const workspaceId = idWorkSpaceSchema.parse(req.params.id);
      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "DELETE_WORKSPACE");

      const {currentWorkspace} = await deleteWorkSpaceService(workspaceId, userId);

      return res.status(httpStatus.OK).json({
            message: "Successfully deleted workspace",
            currentWorkspace
      })
}

module.exports = {
      createWorkSpaceController, getUserWorkSpacesController, getWorkSpaceController, getMembersInWorkSpaceController, 
      getWorkspaceAnalyticsController, changeWorkspaceMemberRoleController, updateWorkSpaceController, deleteWorkSpaceController
}