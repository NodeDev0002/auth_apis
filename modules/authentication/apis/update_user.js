const UserModel = require('./models/users_model');
const app = express();
var express = require('express');


app.post('/updateUser', async (req, res) => {
    console.log('Update User Api Calling.. !!');
    try {
        var { id } = req.body;
        var updateData = await UserModel.find();
        giveResponse(res, true, 200, "Data Added..!", updateData);
        // res.status(200).json({ message: "Please Come " });
    } catch (err) {
        console.log(err);
        giveResponse(res, false, 400, "Something went wrong", {});
    }
});
