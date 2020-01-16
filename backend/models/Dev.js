const moongose = require('mongoose');

const DevSchema = new moongose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],

});

module.exports = moongose.model('Dev,', DevSchema);