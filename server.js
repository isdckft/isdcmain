require('./rest/config/config');

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
//const compileSass = require('sass');
const path = require('path');
const _ = require('lodash');
const bodyParser = require('body-parser');
//const {ObjectID} = require('mongodb');

//var {mongoose} = require('./rest/db/mongoose');
var {Article} = require('./rest/models/article');
var {User} = require('./rest/models/user');
var {authenticate} = require('./rest/middleware/authenticate');

const port = process.env.PORT || 4200; 
var app = express();

hbs.registerPartials(__dirname + '/views/viewparts');
app.set('view engine', 'hbs');
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   var now = new Date().toString();
//   var log = `${now}: ${req.method} ${req.url} ${port}`;

//   console.log(log);
//   fs.appendFile('server.log', log + '\n', (err) => {
//     if (err) throw err;
// });
//   next();
// });

app.use(express.static(__dirname + '/'));

// app.use('/assets/css/:cssName', compileSass({
//   sassFilePath: path.join(__dirname, '/assets/scss/'),
//   sassFileExt: 'scss',
//   embedSrcMapInProd: true
// }));



hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});


app.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'Welcome to the isdckft demo site!',
  });
});

app.get('/home', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
  });
});

app.get('/tutorial/html', (req, res) => {
  res.render('tutorial/html.hbs', {
    pageTitle: 'HTML Basics',
  });
});

app.get('/tutorial/css', (req, res) => {
  res.render('tutorial/css.hbs', {
    pageTitle: 'CSS - Bootstrap',
  });
});

app.get('/tutorial/environment', (req, res) => {
  res.render('tutorial/environment.hbs', {
    pageTitle: 'Installation on Windows client',
  });
});

app.get('/tutorial/js', (req, res) => {
  res.render('tutorial/js.hbs', {
    pageTitle: 'JavaScript',
  });
});

app.get('/tutorial/linux', (req, res) => {
  res.render('tutorial/linux.hbs', {
    pageTitle: 'Server settings, Ubuntu linux',
  });
});

app.get('/tutorial/ml', (req, res) => {
  res.render('tutorial/ml.hbs', {
    pageTitle: 'Machine learning, Python and Angular',
  });
});

app.get('/tutorial/angular', (req, res) => {
  res.render('tutorial/angular.hbs', {
    pageTitle: 'Create an Angular app',
  });
});

app.get('/tutorial/nodejs', (req, res) => {
  res.render('tutorial/nodejs.hbs', {
    pageTitle: 'Node.Js - npm',
  });
});

app.get('/tutorial/python', (req, res) => {
  res.render('tutorial/python.hbs', {
    pageTitle: 'Python, Django',
  });
});

app.get('/tutorial/ts', (req, res) => {
  res.render('tutorial/ts.hbs', {
    pageTitle: 'Typescript Fundamentals',
  });
});


//  REST API

//POST /users - Registration , create a new user
app.post('/rest/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});


// POST USER login
app.post('/rest/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// GET - Who am I
app.get('/rest/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// Delete token. Logout
app.delete('/rest/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


// // New Article 
app.post('/rest/articles', authenticate, (req, res) => {

  var article = new Article({
    author: req.body.author,
    title: req.body.title,
    desc: req.body.desc,
    url: req.body.url,
    completedAt: new Date(),
    _creator: req.user._id
  });

  article.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// List of the articles of a user
app.get('/rest/articles', authenticate, (req, res) => {
  Article.find({
    _creator: req.user._id
  }).then((articles) => {
    res.send({articles});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get One Article by ID
app.get('/rest/articles/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Article.findOne({
    _id: id,
    _creator: req.user._id
  }).then((article) => {
    if (!article) {
      return res.status(404).send();
    }

    res.send({article});
  }).catch((e) => {
    res.status(400).send();
  });
});



// Update one article
app.patch('/rest/articles/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['author', 'title', 'desc', 'url']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  body.completedAt = new Date().getTime();


  Article.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((article) => {
    if (!article) {
      return res.status(404).send();
    }

    res.send({article});
  }).catch((e) => {
    res.status(400).send();
  })
});



// delete One Article by id
app.delete('/rest/articles/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Article.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  }).then((article) => {
    if (!article) {
      return res.status(404).send();
    }

    res.send({article});
  }).catch((e) => {
    res.status(400).send();
  });
});

// app.listen(port, '127.0.0.1' ,() => {
//   console.log(`Server is up on port ${port}`);
// });

var server = app.listen(port, function () {
  var host = server.address().address;
  console.log("app listening at http://%s:%s", host, port);
});
module.exports = {app};