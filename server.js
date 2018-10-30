/*
STARTING A WEB Server

- Use app.use() & express.static() methods to include a directory of static html pages to the applicaiton.

<!--
- Use {{> filename}} syntax to include partial files that are located in the directory that has been registered to hbs using hbs.registerPartials(absDirectory) function
  - Do not need to include file extension when using partials because they have been registered to the hbs module and are therefore expected to be .hbs files.
-->

*/

const express = require('express');
const hbs = require('hbs');   //hbs is a view engine (all hbs views must use the .hbs extension)
const fs = require('fs');

//Configure port variable to process.env.PORT or 3000 if the variable does not exist.
const port = process.env.PORT || 3000;

//Create express application (app)
let app = express();

hbs.registerPartials('./views/partials');   //Registers the partials in the views/partials directory so that can be used by the .hbs files in the res.render() methods
app.set('view engine', 'hbs');  //Configures the apps'view engine' application setting to the hbs view engine
//Regist middleware using app.use(function) method
app.use(express.static('./public'));   //Includes all contents of the public directory in the application

//Create a logger that executes for every request to the app
app.use((req, res, next) => {
  let now = new Date();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log');
    }
  });
  next();
});

//Create middleware that takes user to a maintenance page
app.use((req, res, next) => {
  res.render('maintenance.hbs', {
    pageTitle: 'Maintenance Page'   //Use locals in template page (.hbs file) by enclosing local name within doublde curly braces {{pageTitle}}
  });
});

//Register a helper (helper function is called wherever helper is used) called using {{getCurrentYear}}
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//Create an http get request to the root path & send some data
// app.get('/', (req, res) => {
//   // res.send('<h1>Hello Express</h1>');    //Sends a single string
//   res.send({
//     Name: 'Bezan',
//     Email: 'bezan@email.com'
//   });
// });

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

//Use res.render() method to render the about.hbs view template
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'    //Local variables that can be used in the about.hbs page by placing the variables within double curly braces {{pageTitle}}
  });
});

//Use res.send() method to send contents when an http get request is made to the /random path
app.get('/random', (req, res) => {
  res.send('<p>This is a random page</p>');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); //Open localhost:3000 to view
