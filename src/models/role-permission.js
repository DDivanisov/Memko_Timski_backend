const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
      name: { type: String, enum: ['Owner', 'Admin', 'Member'], required: true, unique: true },
      permissions: { 
            type: [String], 
            enum: ["CREATE_WORKSPACE",
                  "DELETE_WORKSPACE",
                  "EDIT_WORKSPACE",
                  "MANAGE_WORKSPACE_SETTINGS",
                  "ADD_MEMBER",
                  "CHANGE_MEMBER_ROLE",
                  "REMOVE_MEMBER",
                  "CREATE_PROJECT",
                  "EDIT_PROJECT",
                  "DELETE_PROJECT",
                  "CREATE_TASK",
                  "EDIT_TASK",
                  "DELETE_TASK",
                  "VIEW_ONLY",], 
            default: [] }
},{
      timestamps: true,
      toJSON: { 
            transform: function(doc, ret) {
                  delete ret.__v;
            }
      },
});

const RoleModel = mongoose.model('Role', RoleSchema);

module.exports = { RoleModel };