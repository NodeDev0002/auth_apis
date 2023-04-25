var userModel = require('./modules/authentication/models/users_model.js');

addUser( async (req, res) =>  {
    var userData = await  userModel.find();
    return res.status(200).json({ users: userData });
});





