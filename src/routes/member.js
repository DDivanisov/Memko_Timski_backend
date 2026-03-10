const {Router} = require('express');
const { joinWorkspaceController } = require('../controllers/member');


const MemberRout = Router();

MemberRout.post(
      "/workspace/:inviteCode/join", 
      joinWorkspaceController
);

module.exports = MemberRout;