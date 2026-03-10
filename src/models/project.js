const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, default: '', required: false },
      workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
      emoji: { type: String, default: '📁', required: false },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{
      timestamps: true,
      toJSON: { 
            transform: function(doc, ret) {
                  delete ret.__v;
            }
      },
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = { ProjectModel };