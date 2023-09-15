//https://waelyasmina.medium.com/a-guide-into-using-handlebars-with-your-express-js-application-22b944443b65

var fs      = require('fs'),
    util    = require('util'),
    express = require('express'),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser');
 
var app = express();
var port = 3000;

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
    const jsonParsed = JSON.parse(data);
    //console.log('Parsed JSON data:', jsonParsed);

    // access elements to create variables
    resourceType      = jsonParsed.resourceType;
    profile           = jsonParsed.meta.profile[0];

    console.log('The resource type is :', resourceType);
    console.log('The profile is :', profile);

    var keyCount  = Object.keys(jsonParsed).length;
    console.log('Parsed JSON data:', keyCount);
 
/*
        for (i = 1; i <= keyCount; i++) {
          console.log('i:', i);
          console.log(jsonParsed[i]);
        }
*/

      for(var i in jsonParsed) {
        if ( jsonParsed[i] == "identifier" ){
          console.log( "FOO!" );
        }
        console.log(i + ": " + jsonParsed[i]);
      }

      res.render("home", {profile: profile})

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});


});


app.listen(port, () => console.log("Server started and listening on port " + port ));