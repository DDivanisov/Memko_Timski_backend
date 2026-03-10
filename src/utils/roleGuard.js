const { httpStatus } = require("../config/http.config")
const { AppError } = require("./appError")

const roles = {
      "Admin": ['ADD_MEMBER', 'CREATE_PROJECT','EDIT_PROJECT', 'DELETE_PROJECT', 'CREATE_TASK', 'EDIT_TASK','DELETE_TASK','MANAGE_WORKSPACE_SETTINGS','VIEW_ONLY'],
      "Owner": ['CREATE_WORKSPACE','EDIT_WORKSPACE','DELETE_WORKSPACE','CHANGE_MEMBER_ROLE','REMOVE_MEMBER','ADD_MEMBER', 'CREATE_PROJECT','EDIT_PROJECT', 'DELETE_PROJECT', 'CREATE_TASK', 'EDIT_TASK','DELETE_TASK','MANAGE_WORKSPACE_SETTINGS','VIEW_ONLY'],
      "Member": ['VIEW_ONLY', 'CREATE_TASK', 'EDIT_TASK'],
}

const roleGuard = (roleName, premission) => {
      const permissionsToCheck = Array.isArray(premission) 
    ? premission 
    : [premission];
      const premissions = roles[roleName];
      
      const hasPermission = permissionsToCheck.every((p) => 
      premissions.includes(p));

      if(!hasPermission){
            throw new AppError("You don't have premission for that action.", httpStatus.UNAUTHORIZED);

      }
     
}

module.exports = {roleGuard};