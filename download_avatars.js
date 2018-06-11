var request = require('request');
var secrets = require('./secrets.js')

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
    var data = JSON.parse(body)
    cb(err, data);

  });
}

getRepoContributors("jquery", "jquery", function(err, data) {
  console.log("Errors:", err);
  console.log("Avatar URLs: ");

  for (var i = 0; i < data.length; i ++ ) {
    console.log(data[i].avatar_url);
  }

});