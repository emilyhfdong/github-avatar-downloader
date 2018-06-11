var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    for (var i = 0; i < data.length; i ++ ) {
      var filePath = './avatars/' + data[i].login + '.jpg';
      var avatarURL = data[i].avatar_url;
      downloadImageByURL(avatarURL, filePath);
    }

  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));

}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")

getRepoContributors("jquery", "jquery");

