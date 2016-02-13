var Sequelize = require('sequelize');

var reddit = new Sequelize('reddit', 'somaba','', {
    dialect: 'mysql'
})

// we tell Sequelize what are our tables and what's on
//define Method ==> Sequelize add the attributes createdAt and updatedAt

var Users = reddit.define('users', {
    email: Sequelize.STRING,
    screen_name: Sequelize.STRING,
    password: Sequelize.STRING
})

var Posts = reddit.define('posts', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

var Votes = reddit.define('votes', {
    upVotes: Sequelize.BOOLEAN
});

//Associations
Users.hasMany(Posts);
Posts.belongsTo(Users);
Users.belongsToMany(Posts, {through: Votes, as: 'Upvotes'})
Posts.belongsToMany(Users, {through: Votes});



Users.create({email: 'sonia@sonia.com', screen_name: 'Soso', password: 'abcdef'}).then(function(user){
        user.createPost({
            url: 'test',
            title: 'testerferferfer'
        })
})

Users.create({email: 'sonia@sonia.com', screen_name: 'Soso', password: 'abcdef'}).then(function(user){
        user.createPost({
            url: 'http://www.decodemtl.com',
            title: 'Student at DecodeMTL'
        })
})


function createNewUser (username, password, callback){
    return Users.create({
        username: username,
        password: password
    }).then(function(user){
        if (typeof callback === 'function') {
            callback(user);
        }
    });
}
createNewUser('robert', 'password', function(newguy){console.log(JSON.stringify(newguy, 0 , 2))});

function createNewContent (userID, url, title, callback){
    Users.findById.then(function(user){
        user.createPost({
        url: url,
        title: title
        }).then(function(user){
            callback(user);
        })
    });
    
}
createNewContent(1, 'http://www.google.com', 'Google', function(user){console.log(JSON.stringify(user, 0 , 2))});

reddit.sync();