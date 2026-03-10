const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
      userId:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
      provider:{type: String, required: true },
      providerId:{ type: String, required: true, unique: true },
      refreshToken:{ type: String, default: null },
      tokenExpiresAt:{ type: Date, default: null },

},{
      timestamps: true,
      toJSON: { 
            transform: function(doc, ret) {
                  delete ret.__v;
                  delete ret.refreshToken;
            }
      },
});

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = { AccountModel };