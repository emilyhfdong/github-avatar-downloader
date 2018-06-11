var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

require('dotenv').config()


// Take command line arguments as inputs
var owner = process.argv[2];
var name = process.argv[3];


console.log('Welcome to the GitHub Avatar Downloader!');

// Make arguments required
if (owner == undefined) {
  console.log('Error: Please define a repo owner');
}
if (name == undefined) {
  console.log('Error: Please define a repo name');
}

//Define function to get repo contributor data
function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.GITHUB_TOKEN
    }
  };


  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(data);
  });
}

// function to download image, given the url and the login data
function downloadImageByURL(url, filePath) {
  if (!fs.existsSync('./avatars')){
    fs.mkdirSync('./avatars');
  }

  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));

}

// call function to download image by url
getRepoContributors(owner, name, function (data) {
  for (var i = 0; i < data.length; i ++ ) {
    var filePath = './avatars/' + data[i].login + '.jpg';
    var avatarURL = data[i].avatar_url;
    downloadImageByURL(avatarURL, filePath);
  }
});

