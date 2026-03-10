const { Router } = require("express");
const {getCurrentUserController} = require('../controllers/user.js')



const UserRout = Router();


UserRout.get(
      '/current',
      getCurrentUserController
);


module.exports = UserRout;