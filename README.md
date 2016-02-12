# Let's build a reddit clone!

![reddit](https://i.imgur.com/8IZ0jRT.jpg)

In this workshop we will start building a reddit clone. We will take our clone further next week as we learn more about HTTP and how to create web servers and services.

## Data model
For the first part of this workshop we will be building a simple data model for our reddit clone using a MySQL database. All the tables of our model should have a unique ID field as well as createdAt and updatedAt fields that will be timestamps. We will start with the following tables:

  * Users: each user should have an email, screen name, password.
  * Posts: each post should have the URL of the post, a title, and a reference to the user who posted it
  * Votes: each vote has a link to a user, a link to a post, and an up/down flag

Write the `CREATE TABLE` statements you are using in a file called `create.sql`, commit, push and **create a pull request for your master branch**.

## Implementing the data model with Sequelize
In class, we saw how we could tell Sequelize about an existing data model. It turns out that if we are starting a new project immediately with Sequelize, we can do even simpler.

We can tell Sequelize about our data model, and **let it `CREATE TABLE`s itself**, setup all the fields on it and figure out the correct types. All we need to do that is to run `sequelize.sync()` after having told it about our data model.

**NOTE**: *In a production system, we will NEVER use `sequelize.sync`!* Sequelize will try to modify or create table structures, and this can be completely destructive in an already running application. Regardless, it *is* a good way to get started :)

This code tells Sequelize about the three tables of our model:

```javascript
var User = db.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING // TODO: make the passwords more secure!
});

// Even though the content belongs to users, we will setup the userId relationship later
var Content = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});

// Even though a vote has a link to user and content, we will setup the relationship later
var Vote = db.define('vote', {
    upVote: Sequelize.BOOLEAN
});

// User <-> Content relationship
Content.belongsTo(User); // This will add a `setUser` function on content objects
User.hasMany(Content); // This will add an `addContent` function on user objects

// User <-> Vote <-> Content relationship
User.belongsToMany(Content, {through: Vote, as: 'Upvotes'}); // This will add an `add`
Content.belongsToMany(User, {through: Vote});

db.sync(); // Only needs to be used once!
```
For this part of the workshop most of the code has already been written for you. You have to load the Sequelize library, setup a connection, and then run the code. The `db.sync()` at the end will actually create the tables, so you should start this with an **empty database**.

You won't get off that easy though. Because the code has been created for you, you'll need to look at it and understand what's going on.

The Sequelize documentation is complete, and even though it's not the easiest thing to read, this part of the workshop will make you read the Sequelize documentation on how to create models and their associations:

  * [Sequelize model definitions](http://docs.sequelizejs.com/en/latest/docs/models-definition/)
  * [Sequelize associations](http://docs.sequelizejs.com/en/latest/docs/associations/)

It is in your interest to **read and understand** these two sections of the documentation. You should also keep a bookmark to the Sequelize documentation site, as well as have it open at all times when coding with it :)

Create a file called `data-model.txt`. In it, write a few sentences to explain what each part of the data model definition is doing. **Commit and push so we can see it in your PR.**

## Get me some data
Now that we have told Sequelize about our data model, it's time to start writing our data functions. The following three sections of Sequelize's documentation will help you with writing the data functions:

  * [Sequelize model usage](http://docs.sequelizejs.com/en/latest/docs/models-usage/)
  * [Querying data with Sequelize](http://docs.sequelizejs.com/en/latest/docs/querying/)
  * [Sequelize instance methods](http://docs.sequelizejs.com/en/latest/docs/instances/) (*a bit less useful*)

Based on this documentation, write some Sequelize-based code for the following data functions. Continuing from the same file you created in part 2, do the following:

  1. Write a function called `createNewUser` that takes a username, password and callback. This function will [create a new user with Sequelize](http://docs.sequelizejs.com/en/latest/api/model/#createvalues-options-promiseinstance) and call the callback once the user has been created
  2. Write a function called `createNewContent` that takes a user *ID*, a URL, a title and a callback. This function will create a new Content item that is immediately associated with the user object passed to it. Once the content is created, your function will call the callback with that content.

  Note that you will have to [find the user by its ID](http://docs.sequelizejs.com/en/latest/api/model/#findbyidoptions-promiseinstance) before you can [associate the content to the user](http://docs.sequelizejs.com/en/latest/api/associations/).
  3. Write a function called `voteOnContent` that takes a content *ID*, user *ID*, a isUpVote boolean and a callback. This function will create a new vote for a piece of content and for the user that was passed to it.

  The [Sequelize associations documentation](http://docs.sequelizejs.com/en/latest/docs/associations/#associating-objects) will be of great help for this part.

Commit and push so we can see your work.
