const { connectDatabase } = require('../config/database.config');
const mongoose = require('mongoose');
const { RoleModel } = require('../models/role-permission');

const roles = {
      "Admin": ['ADD_MEMBER', 'CREATE_PROJECT','EDIT_PROJECT', 'DELETE_PROJECT', 'CREATE_TASK', 'EDIT_TASK','DELETE_TASK','MANAGE_WORKSPACE_SETTINGS','VIEW_ONLY'],
      "Owner": ['CREATE_WORKSPACE','EDIT_WORKSPACE','DELETE_WORKSPACE','CHANGE_MEMBER_ROLE','REMOVE_MEMBER','ADD_MEMBER', 'CREATE_PROJECT','EDIT_PROJECT', 'DELETE_PROJECT', 'CREATE_TASK', 'EDIT_TASK','DELETE_TASK','MANAGE_WORKSPACE_SETTINGS','VIEW_ONLY'],
      "Member": ['VIEW_ONLY', 'CREATE_TASK', 'EDIT_TASK'],
}



const seedRoles = async () => {
  console.log('Seeding roles...');
  await connectDatabase();

  try{
      const session = await mongoose.startSession();
      session.startTransaction();

      console.log('Clearing existing roles...');
      await RoleModel.deleteMany({}, { session });

      console.log('Inserting new roles...');
      for (const [roleName, permissions] of Object.entries(roles)) {
          const role = new RoleModel({ 
            name: roleName, 
            permissions: permissions
          });
          await role.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
      console.log('Roles seeded successfully.');
  }
  catch(error){
      console.error('Error seeding roles:', error);
  }
};

seedRoles().catch(err => {
  console.error('Unexpected error during seeding:', err);
});