var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

var owner = process.argv[2];
var name = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };


  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));

}


getRepoContributors(owner, name, function (data) {
  for (var i = 0; i < data.length; i ++ ) {
    var filePath = './avatars/' + data[i].login + '.jpg';
    var avatarURL = data[i].avatar_url;
    downloadImageByURL(avatarURL, filePath);
  }
});

