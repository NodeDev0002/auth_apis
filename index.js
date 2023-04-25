console.log("!!! Project Working Start !!!");
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const loginmodel = require('./modules/authentication/models/login_model.js');
const giveResponse = require("./utils");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const axios = require('axios');

// const AddUser = require('./modules/authentication/apis/add_user.js');

var dbUrl = "mongodb+srv://testrtemp22:dXCOfJxwgAZBsN3U@testdababase.ljo4iq2.mongodb.net/user-management-system";
const app = express();
app.use(express.json());

var server = app.listen(3000, function () { 
    var address = server.address().address;
    var port = server.address().port;
    console.log(" Server Working on http://%s:%s", address, port);
});
mongoose.connect(dbUrl).then((value) => {
    console.log(' Database connected successfully...');
}).catch((err) => {
    console.log(err); 
});


app.post('/signup', async (req, res) => {
    console.log('Add User Api Calling.. !!');
    try {
        var { username, password, email } = req.body;
        const existingUser = await loginmodel.findOne({ email });
        if (existingUser) {
            return giveResponse(req, res, false, 400, "User already exist, Please signin.", existingUser);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        var userData = await loginmodel.create({
            username: username,
            password: hashedPassword,
            email: email,
        });
        await userData.save();
        giveResponse(req, res, true, 200, "Signup Successfully..!", userData);
    
    } catch (err) {
        console.log(err);
        giveResponse(req, res, false, 400, "Something went wrong", {});
    }
});

app.get('/allUser', async (req, res) => {
    try {
        var currentPage = parseInt(req.query.currentPage ?? 0);
        var limit = parseInt(req.query.limit ?? await loginmodel.count());
        var totalPage = parseInt(await loginmodel.count() / limit);
        var result = {};
        result.totalPage = totalPage;
        result.currentPage = currentPage;
        result.totalUsers = await loginmodel.count();
        console.log("skipping dats is %s", currentPage * limit);
        console.log("limit dats is %s", limit);
        result.results = await loginmodel.find().skip(currentPage * limit).limit(limit);
        // result.results = await usermodel.find();
         giveResponse(req, res, true, 200, "Data Added..!", result);
    }
    catch (err) {
        console.log(err);
        giveResponse(req, res, false, 400, "Something went wrong", {});
    }
});


app.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        var user = await loginmodel.findOne({ email });
        if (!user) {
            return giveResponse(req, res, false, 400, "User not exist, Please create acc first.", {});
        }
        console.log(" PASSWORD IS %s", user.password);
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log(" Valid Password Is %s", isValidPassword);
        if (!isValidPassword) {
            return giveResponse(req, res, false, 400, "Invalid Email or password.", {});
        }
        var token = jwt.sign({ userId: user._id ,email : user.email}, 'JWTsecretKey');
        var result = {};
        user.token = token; 
        return giveResponse(req, res, true, 200, "Login Successfully.", user);
    }
    catch (err) {
        console.log(err);
        return giveResponse(req, res, false, 400, "Something went wrong", {});
    }
});


const storageEngine = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});
const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
const path = require("path");

const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};

app.post("/uploadFile", upload.single('image'),  async (req, res) => {
    if (req.file) { 
        var email = req.body.email; 
        console.log('email is %s', email);
        // const user = loginmodel.findOne({ email: email });
        var fileName = path.join(__dirname, "images", req.file.filename);
        var user = await loginmodel.findOneAndUpdate({ email: email }, { username: "Test", profilePic: fileName }, { new: true });
        // user.save();
        giveResponse(req, res, true, 200, "Image Uploaded Successfully..", user);
    } else {
        giveResponse(req, res, false, 400, "Please upload valid image..", {});
    }
});
 

app.get('/images/:filename', async function (req, res, next) {
    // Retrieve the filename from the URL parameter

    const response = await axios.get(`http://api.ipstack.com/${req.ip}?access_key=068c3659efdd91a65e2203c2e8797db4`);
    console.log(" HEY HEY KRUPALL ");
    console.log(" IP ADDESSS %s ", req.ip);
    console.log(" API RESPONSE  %s ", response);
    console.log(" Location OF USER IS %s ", response.data);
    console.log(" Location ==>>> %s ", response.data.location);
    const filename = req.params.filename;
    // Construct the file path
    const filePath = path.join(__dirname, 'images', filename);

    // Send the file as a response
    res.sendFile(filePath);
});