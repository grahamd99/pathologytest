//const Handlebars = require("handlebars");
//const template = Handlebars.compile("Name: {{name}}");
//console.log(template({ name: "Nils" }));
const hbs = require('hbs')


var fs      = require('fs'),
    util    = require('util'),
    xml2js  = require('xml2js'),
    express = require("express"),
    bodyParser = require("body-parser");
 
var parser = new xml2js.Parser();
var app = express();
var port = 3000;
var fileToParse = "./public/examples/pathology_example1.json";

//global.fileToValidate = "test.xml";

// Serve Static Assets
app.use(express.static("public"));
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "hbs");

//var source = document.getElementById("entry-template").innerHTML;
//var template = Handlebars.compile(source);


//var context = { title: "My New Post", body: "This is my first post!" };
//var html = template(context);


app.get('/', function(req, res){
    res.render('Home', {
       array: ['One', 'Two', 'Three', 'Four'],
       message: 'Greetings from geekforgeeks'
    })
})


app.listen(port, () => console.log("Server started and listening on port " + port ));