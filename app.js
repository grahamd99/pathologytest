//const Handlebars = require("handlebars");
//const template = Handlebars.compile("Name: {{name}}");
//console.log(template({ name: "Nils" }));
//const hbs = require('hbs')

//https://waelyasmina.medium.com/a-guide-into-using-handlebars-with-your-express-js-application-22b944443b65

   //  xml2js  = require('xml2js'), 

var fs      = require('fs'),
    util    = require('util'),
    express = require('express'),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser');
 
//var parser = new xml2js.Parser();
var app = express();
var port = 3000;

//global.fileToValidate = "test.xml";

// Serve Static Assets
app.use(express.static("public"));
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');
app.engine(
    "hbs",
    handlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "main",
  })
);

const filePath = "./public/examples/pathology_example1.json";

app.get("/",function(req,res){

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  try {
    const jsonObject = JSON.parse(data);
    console.log('Parsed JSON data:', jsonObject);

    // Access properties of the object
    console.log('The resource type is :', jsonObject.resourceType);
    console.log('The ID is:', jsonObject.id);

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});

  res.render("home");
});


app.listen(port, () => console.log("Server started and listening on port " + port ));