const fs = require('fs');
const os = require('os');

giveResponse = async (req, res, status, statusCode, message, model) => {
    console.log("giveResponse :: %s", message);
    var StringMSG = status == true ? "\n \n" + Date().toLocaleString() + "\n 🟢 " + message + " 🟢 " + req.url + " 🟢 " : "\n \n " + Date().toLocaleString() + "\n 🔴" + message + " 🔴 " + req.url + " 🔴 ";
    console.log("giveResponse :: %s", StringMSG);
    fs.writeFile('api-log.txt', StringMSG, { flag: 'a' }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Data written to log.txt successfully!');
        }
    });
    return res.status(statusCode).json({ status: status, message: message, data: model });
};

module.exports = giveResponse