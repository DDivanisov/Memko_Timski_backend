const { httpStatus } = require('../config/http.config.js');
const { isUserMemberService } = require('../services/member.js');
const {createProjectService, getWorkspaceProjectsService, getProjcetService, getProjectAnalyticsService, updateProjectService, deleteProjectService} = require('../services/project.js');
const { roleGuard } = require('../utils/roleGuard.js');
const {createProjectSchema, updateProjectSchema, projectIdSchema}  = require('../validation/project.js');
const { idWorkSpaceSchema } = require('../validation/workspace.js');

const createProjectController = async(req, res) => {
      const result = createProjectSchema.parse(req.body);
      
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "CREATE_PROJECT");
      
      const {project} = await createProjectService(userId, workspaceId, result);

      return res.status(httpStatus.CREATED).json({
            message: "Project successfully created.",
            project
      })
}


const getWorkspaceProjectsController = async(req,res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);

      const pageSize = parseInt(req.query.pageSize) || 10;
      const pageNumber = parseInt(req.query.pageNumber) || 1;


      const {projects, totalCount, totalPages, skip} = await getWorkspaceProjectsService(workspaceId, pageNumber, pageSize);

      return res.status(httpStatus.OK).json({
            message: "Projects fetched.",
            projects,
            pagination:{
                  totalCount,
                  pageSize,
                  pageNumber, 
                  totalPages,
                  skip, 
                  limit: pageSize
            } 
      })
}

const getProjcetController = async (req, res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const userId = req.user._id;
      const projectId = projectIdSchema.parse(req.params.id);

      const {role} = await isUserMemberService(userId, workspaceId);

      const {project} = await getProjcetService(projectId, workspaceId);

      return res.status(httpStatus.OK).json({
            message: "Project fetched",
            project
      });
}

const getProjcetAnalyticsController = async (req, res) => {
      const projectId = projectIdSchema.parse(req.params.id);
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);
       
      const {analytics} = await getProjectAnalyticsService(workspaceId, projectId);
      return res.status(httpStatus.OK).json({
            message: "Analytics fetched successfully",
            analytics
      })
}

const updateProjectController = async (req, res) => {
      
      const result = updateProjectSchema.parse(req.body);
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const projectId = projectIdSchema.parse(req.params.id);

      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "EDIT_PROJECT");

      const {project} = await updateProjectService(workspaceId, projectId, result);
      
      return res.status(httpStatus.OK).json({
            message: "Project updated successfully",
            project
      })
}

const deleteProjectController = async (req, res) => {
      const workspaceId = idWorkSpaceSchema.parse(req.params.workspaceId);
      const projectId = projectIdSchema.parse(req.params.id);

      const userId = req.user._id;

      const {role} = await isUserMemberService(userId, workspaceId);
      roleGuard(role, "DELETE_PROJECT");

      await deleteProjectService(workspaceId, projectId);

      return res.status(httpStatus.OK).json({
            message: "Project successfully deleted"
      })
}

module.exports = {createProjectController, getWorkspaceProjectsController, getProjcetController,getProjcetAnalyticsController, updateProjectController, deleteProjectController}