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

  var patientProfile = '';
  var patientNHS = '';
  var specimenProfile = '';
  var specimenTypeCode  = '';
  var specimenTypeDesc  = '';

  try {
    const jsonParsed = JSON.parse(data);
    console.log('Parsed JSON data:', jsonParsed);

    // access elements to create variables
    resourceType      = jsonParsed.resourceType;
    profile           = jsonParsed.meta.profile[0];

  // Check if the JSON has the expected structure
    if (jsonParsed.resourceType === 'Bundle' && Array.isArray(jsonParsed.entry)) {
      // Loop through the 'entry' array
      jsonParsed.entry.forEach(entry => {
        if (entry.resource && entry.resource.resourceType === 'MessageHeader') {
          // Access MessageHeader information
          const fullUrl = entry.fullUrl;
          const messageId = entry.resource.id;
          const profile = entry.resource.meta.profile[0];

          console.log('MessageHeader');
          console.log('Full URL:', fullUrl);
          console.log('Message ID:', messageId);
          console.log('Profile:', profile);
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'ServiceRequest') {
          console.log('ServiceRequest');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Patient') {
          // Access Patient information
          const fullUrl = entry.fullUrl;
          const messageId = entry.resource.id;
          patientProfile  = entry.resource.meta.profile[0];
          patientNHS      = entry.resource.identifier[0].value;
          console.log('Patient');
          console.log('Patient Profile:', patientProfile);
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Organization') {
          console.log('Organization');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Specimen') {
          specimenProfile   = entry.resource.meta.profile[0];
          specimenTypeCode  = entry.resource.type.coding[0].code;
          specimenTypeDesc  = entry.resource.type.coding[0].display;
          console.log('Specimen');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'DiagnosticReport') {
          console.log('DiagnosticReport');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Practitioner') {
          console.log('Practitioner');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Observation') {
          console.log('Observation');
          console.log('---');
        } else {
          // Handle other resource types if needed
          console.log('Unsupported resource type:', entry.resource.resourceType);
        }
      });
    } else {
      console.log('Invalid JSON structure: Not a FHIR Bundle.');
    }

    res.render("Home", {profile: profile, patientProfile: patientProfile, patientNHS: patientNHS,
                        specimenProfile: specimenProfile, specimenTypeCode: specimenTypeCode, specimenTypeDesc: specimenTypeDesc});

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});


});

app.listen(port, () => console.log("Server started and listening on port " + port ));
