const mongoose = require('mongoose');
const { generateInviteCode } = require('../utils/codeGenerator');

const WorkspaceSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, default: '', required: false },
      inviteCode: { type: String, required: true, unique: true, default: generateInviteCode },
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},{
      timestamps: true,
      toJSON: { 
            transform: function(doc, ret) {
                  delete ret.__v;
            }
      },
});

WorkspaceSchema.methods.resetInviteCode = function() {
      this.inviteCode = generateInviteCode();
}

const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);

module.exports = { WorkspaceModel };