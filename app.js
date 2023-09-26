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

  // define variables to be used to pass through values to Handlebars template
  var messageHeaderProfile= '';
  var messageHeaderCode = '';
  var messageHeaderDesc = '';
  var patientProfile = '';
  var patientNHS = '';          
  var serviceRequestProfile = '';
  var serviceRequestCode  = '';
  var serviceRequestDesc  = '';
  var specimenProfile = '';
  var specimenTypeCode = '';
  var specimenTypeDesc = '';
  var diagnosticReportProfile = '';
  var diagnosticReportCode = '';
  var diagnosticReportDesc = '';
  var observationProfile = '';
  var observationCode = '';
  var observationDesc = '';

  try {
    const jsonParsed = JSON.parse(data);
    console.log('Parsed JSON data:', jsonParsed);

    // access elements to create variables
    bundleResourceType      = jsonParsed.resourceType;
    bundleProfile           = jsonParsed.meta.profile[0];

  // Check if the JSON has the expected structure
    if (jsonParsed.resourceType === 'Bundle' && Array.isArray(jsonParsed.entry)) {
      // Loop through the 'entry' array
      jsonParsed.entry.forEach(entry => {
        if (entry.resource && entry.resource.resourceType === 'MessageHeader') {
          // Access MessageHeader information
          //const fullUrl = entry.fullUrl;
          const messageHeaderId = entry.resource.id;
          messageHeaderProfile = entry.resource.meta.profile[0];
          messageHeaderCode = entry.resource.eventCoding.code;
          messageHeaderDesc = entry.resource.eventCoding.display;

          console.log('MessageHeader');
          //console.log('Full URL:', fullUrl);
          console.log('MessageHeader ID:', messageHeaderProfile);
          console.log('MessageHeaderProfile:', messageHeaderProfile);
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'ServiceRequest') {
          serviceRequestProfile   = entry.resource.meta.profile[0];
          serviceRequestCode  = entry.resource.code.coding[0].code;
          serviceRequestDesc  = entry.resource.code.coding[0].display;
          console.log('ServiceRequest');
          console.log('ServiceRequest Profile:', serviceRequestProfile);
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
          console.log('Specimen Profile:', specimenProfile);
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'DiagnosticReport') {
          diagnosticReportProfile   = entry.resource.meta.profile[0];
          diagnosticReportCode  = entry.resource.code.coding[0].code;
          diagnosticReportDesc  = entry.resource.code.coding[0].display;
          console.log('DiagnosticReport');
          console.log('DiagnosticReport Profile:', diagnosticReportProfile);
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Practitioner') {
          console.log('Practitioner');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Observation') {
          observationProfile   = entry.resource.meta.profile[0];
          observationCode  = entry.resource.code.coding[0].code;;
          observationDesc  = entry.resource.code.coding[0].display;
          console.log('Observation');
          console.log('Observation Profile:', observationProfile);
          console.log('---');
        } else {
          // Handle other resource types if needed
          console.log('Unsupported resource type:', entry.resource.resourceType);
        }
      });
    } else {
      console.log('Invalid JSON structure: Not a FHIR Bundle.');
    }

    res.render("Home", {  bundleProfile :  bundleProfile,
                          messageHeaderProfile: messageHeaderProfile, messageHeaderCode: messageHeaderCode, messageHeaderDesc: messageHeaderDesc,
                          patientProfile: patientProfile, patientNHS: patientNHS,
                          serviceRequestProfile: serviceRequestProfile, serviceRequestCode: serviceRequestCode, serviceRequestDesc: serviceRequestDesc,
                          specimenProfile: specimenProfile, specimenTypeCode: specimenTypeCode, specimenTypeDesc: specimenTypeDesc,
                          diagnosticReportProfile: diagnosticReportProfile, diagnosticReportCode: diagnosticReportCode, diagnosticReportDesc: diagnosticReportDesc,
                          observationProfile: observationProfile, observationCode: observationCode, observationDesc: observationDesc
                        });

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});


});

app.listen(port, () => console.log("Server started and listening on port " + port ));
