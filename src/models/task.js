const mongoose = require('mongoose');
const { generateTaskCode } = require('../utils/codeGenerator');


const TaskSchema = new mongoose.Schema({
      taskCode: { type: String, required: true, unique: true, default: generateTaskCode },
      type: { type: String, enum: ['Bug', 'Feature', 'Improvement', 'Task', 'Sub Task'], required: true },
      title: { type: String, required: true },
      description: { type: String, default: '', required: false },
      project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
      workspace : { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
      status: { type: String, enum: ['Backlog' , 'Todo', 'In Progress', 'In Review' , 'Done'], default: 'Backlog' },
      priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      dueDate: { type: Date, default: null },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{
      timestamps: true,
      toJSON: { 
            transform: function(doc, ret) {
                  delete ret.__v;
            }
      },
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = { TaskModel };