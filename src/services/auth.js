const { UserModel } = require('../models/user.js');
const { AccountModel } = require('../models/account.js');
const { WorkspaceModel } = require('../models/workspace.js');
const { RoleModel } = require('../models/role-permission.js');
const { MemberModel } = require('../models/member.js');
const { AppError } = require('../utils/appError.js');
const mongoose = require('mongoose');
const { httpStatus } = require('../config/http.config.js');

const loginOrCreateAccountService = async ({ provider, providerId, displayName, email, avatarUrl }) => {
      
      const session = await mongoose.startSession();
     try{
      session.startTransaction();
      let user = await UserModel.findOne({email: email}).session(session);

      if(!user){
            user = new UserModel({
                  email: email,
                  name: displayName,
                  profilePicture: avatarUrl,

            });
            await user.save({session});
            
            const account = new AccountModel({
                  userId: user._id,
                  provider: provider,
                  providerId: providerId,
            });
            await account.save({session});

            const workspace = new WorkspaceModel({
                  name: `My Workspace`,
                  description: `Default workspace for ${displayName}`,
                  owner: user._id,
            });
            await workspace.save({session});

            const ownerRole = await RoleModel.findOne({name: 'Owner'}).session(session);

            const member = new MemberModel({
                  userId: user._id,
                  workspaceId: workspace._id,
                  role: ownerRole._id,
                  joinedAt: new Date(),
            });
            await member.save({session});

            user.currentWorkSpace = workspace._id;
            await user.save({session});

      }
      await session.commitTransaction();
      session.endSession();
      return { user };

   } catch(err){
      await session.abortTransaction();
      session.endSession();
      throw err;
   }
   finally{
      session.endSession();
   }     
};


const registerService = async (data) => {
     const session = await mongoose.startSession();
     
     try{
            session.startTransaction();
            
            const existingUser = await UserModel.findOne({email: data.email}).session(session);
            
            if(existingUser){
                  throw new AppError('User with this email already exists', httpStatus.BAD_REQUEST);
            }

            let user = new UserModel({
                  email: data.email,
                  name: data.name,
                  password: data.password,

            });
            await user.save({session});

            const account = new AccountModel({
                  userId: user._id,
                  provider: 'Email',
                  providerId: data.email,
            });
            await account.save({session});

            const workspace = new WorkspaceModel({
                  name: `My Workspace`,
                  description: `Default workspace for ${user.name}`,
                  owner: user._id,
            });
            await workspace.save({session});

            const ownerRole = await RoleModel.findOne({name: 'Owner'}).session(session);

            const member = new MemberModel({
                  userId: user._id,
                  workspaceId: workspace._id,
                  role: ownerRole._id,
                  joinedAt: new Date(),
            });
            await member.save({session});

            await UserModel.findByIdAndUpdate(
            user._id,
            { currentWorkSpace: workspace._id },
            { session }
            );

            await session.commitTransaction();
            session.endSession();
            return { 
                  user
             };
     }
     catch(err){
            await session.abortTransaction();
            session.endSession();
            throw err;
     }
};

const loginService = async (email, password, provider) => {
      const account = await AccountModel.findOne({provider, providerId: email});
      if(!account){
            throw new AppError("An account with this email dose not exist", httpStatus.BAD_REQUEST);
      }

      const user = await UserModel.findById(account.userId);

      if(!user){
            throw new AppError("User not found for the given account",httpStatus.BAD_REQUEST);
      }

      const isMatch = user.comparePassword(password);
      if(!isMatch){
            throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
      }

      return user.omitPassword();
};

module.exports = { loginOrCreateAccountService, registerService, loginService };