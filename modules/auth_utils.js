const crypto = require('crypto');

//Secret must be stored in an env. variable in the finished app
const secret = 'dronningmaudsland';
let utils = {};

//--------------
utils.decodeCred = function (credString) {
  let cred = {};

  //remove word basic
  let b64String = credString.replace('basic ', '');

  //convert to ascii
  let asciiString = Buffer.from(b64String, 'base64').toString('ascii');

  //extract username with regex
  cred.username = asciiString.replace(/:.*/, '');

  //extract password
  cred.password = asciiString.replace(cred.username + ':', '');

  return cred;
};

//--------------
utils.createHash = function (password) {};

//--------------------
utils.createToken = function (username, userID) {};

//--------------
utils.verifyToken = function (token) {};

module.exports = utils;
