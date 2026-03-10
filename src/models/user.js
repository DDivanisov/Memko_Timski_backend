const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/bcrypt');


const userSchema = new mongoose.Schema({
      name:{ type: String, required: true },
      email:{ type: String, required: true, unique: true },
      password:{ type: String, required: false, select: true },
      profilePicture:{ type: String, default: null },
      isActive:{ type: Boolean, default: true },
      lastLogin:{ type: Date, default: null },
      currentWorkSpace:{ type: mongoose.Schema.Types.ObjectId, ref:'Workspace', default:null }
}, { 
      timestamps: true,
      toJSON: {
            transform: function(doc, ret) {
                  delete ret.__v;
                  delete ret.password;
            }
      }
});

userSchema.pre("save", async function () {
      if (this.isModified("password")) {
            this.password = await hashPassword(this.password);
      }
      this.updatedAt = new Date();
});

userSchema.methods.omitPassword = function() {
      const obj = this.toObject();
      delete obj.password;
      return obj;
}

userSchema.methods.comparePassword = async function(password) {
      const isMatch = await comparePassword(password, this.password);
      return isMatch;
}

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };