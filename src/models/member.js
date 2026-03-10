const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
      joinedAt: { type: Date, default: Date.now },
      role: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
},{
      timestamps: true,
      toJSON: { 
            transform: function(doc, ret) {
                  delete ret.__v;
            }
      },
});

const MemberModel = mongoose.model('Member', MemberSchema);

module.exports = { MemberModel };  