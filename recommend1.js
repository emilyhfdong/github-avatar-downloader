var request = require('request');
var fs = require('fs');

require('dotenv').config();

// Make sure there are no problems with the .env file
if (!fs.existsSync('./.env')) {
    console.log('Error: .env file does not exist');
}
if(!process.env.GITHUB_TOKEN) {
  console.log('.env file is missing information');
}


// Take command line arguments as inputs
var owner = process.argv[2];
var name = process.argv[3];

var loginArr = [];
var starredDataArr = [];
var fullnameObj = {};
var lengthToStop;
var fullnameArr = [];

function getRepoContributors(repoOwner, repoName, cb1, cb2, cb3) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN
    }
  };


  request(options, function(err, res, body) {
    if (err) {
      throw err;
    }
    var data = JSON.parse(body);
    lengthToStop = data.length;
    cb1(data, cb2, cb3); //cb1 is getLogin
  });
}

function getLogin (data, cb2, cb3) {
  for (var i = 0; i < data.length; i ++ ) {
    loginArr.push(data[i].login)
  }
  cb2(loginArr, cb3); //cb2 is get starredData
}

function getStarredData (loginArr, cb3) {
  for (let i = 0; i < loginArr.length; i ++ ) {

    var starOptions = {
      url: 'https://api.github.com/users/' + loginArr[i] + '/starred',
      headers: {
        'User-Agent': 'request',
        'Authorization': 'token ' + process.env.GITHUB_TOKEN
      }
    }

    request(starOptions, function(err, res, body){
      if (err) {
        throw err;
      }
      var starredData = JSON.parse(body);

      cb3(starredData); //cb3 is getRecommendations
    })

  }

}

function getRecommendations (starredData) {
  starredDataArr.push(starredData);
  if (starredDataArr.length === lengthToStop) {
    for (let j = 0; j < starredDataArr.length; j ++ ){
      for (let k = 0; k < starredDataArr[j].length; k ++ ) {
        fullnameArr.push(starredDataArr[j][k].full_name);
      }
    }

    for (let l = 0; l < fullnameArr.length; l ++) {
      if (!fullnameObj[fullnameArr[l]]){
        fullnameObj[fullnameArr[l]] = 1;
      } else {
        fullnameObj[fullnameArr[l]] += 1;
      }
    }

    console.log(fullnameObj);

  }


}

//console.log(starredDataArr);

getRepoContributors(owner, name, getLogin, getStarredData, getRecommendations);







