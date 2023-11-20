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
//const filePath = "./pathology_example2.json";

/*
var hbs = handlebars.create({});
hbs.handlebars.registerHelper("compareStrings", function (p, q, options) {
  return p == q ? options.fn(this) : options.inverse(this);
});
*/

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
  var specimenIdentifier = '';
  var specimenCollectedDateTime = '';
  var diagnosticReportProfile = '';
  var diagnosticReportCode = '';
  var diagnosticReportDesc = '';
  var practitionerProfile = '';
  var practitionerAddress = '';
  var practitionerName = '';
  global.obsCounter = 0;
  global.obsProfile = []; 
  global.obsCode = []; 
  global.obsDisplay = []; 
  global.obsValueCode = []; 
  global.obsValueDisplay = []; 
  global.obsBodySiteCode = []; 
  global.obsBodySiteDisplay = []; 

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
          specimenCollectedDateTime = entry.resource.collection.collectedDateTime;
          specimenIdentifier        = entry.resource.identifier[0].value;
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
          practitionerProfile = entry.resource.meta.profile[0];
          practitionerAddress = entry.resource.address[0].text;
          practitionerName    = entry.resource.name[0].text;
          console.log('Practitioner');
          console.log('---');
        } else if (entry.resource && entry.resource.resourceType === 'Observation') {


          global.obsCounter++;
          i=global.obsCounter-1;
          console.log('obsCounter =' + obsCounter);

          global.obsProfile[i] = entry.resource.meta.profile[0];

          thisCode = entry.resource.code.coding[0].code;
          global.obsCode[i]    = thisCode;   
          global.obsDisplay[i] = entry.resource.code.coding[0].display;

          // hardcoded list of Observation.code SNOMED codes where a bodysite is expected
          const myList1 = ['1234', '4321'];
          if ( myList1.indexOf(thisCode) !== -1){
            var bodyStructureNum = entry.resource.component.length;
            console.log("The number of bodys structures is " + bodyStructureNum );
            global.obsBodySiteCode[i] = "";
            global.obsBodySiteDisplay[i] = "";
            var delim;
            if ( bodyStructureNum > 1  ){
              delim = ". ";
            } else {
              delim = "";
            }
            for (var x in entry.resource.component ) {
              console.log( "x=" + x );
              global.obsBodySiteCode[i]    = global.obsBodySiteCode[i]    + entry.resource.component[x].valueCodeableConcept.coding[0].code + delim;   
              global.obsBodySiteDisplay[i] = global.obsBodySiteDisplay[i] + entry.resource.component[x].valueCodeableConcept.coding[0].display + delim;   
            }
          } else {
            global.obsBodySiteCode[i] = '';
            global.obsBodySiteDisplay[i] = '';
          }

          const myList2 = ['9999', '7777'];
          if ( myList2.indexOf(thisCode) !== -1){
            global.obsValueCode[i] = entry.resource.valueCodeableConcept.coding[0].code;
            global.obsValueDisplay[i] = entry.resource.valueCodeableConcept.coding[0].display;
          } else {
            global.obsValueCode[i] = '';
            global.obsValueDisplay[i] = '';
          }

          console.log('Observation index: ' + i);
          console.log('Observation SNOMED CODE: ' + global.obsCode[i]);
          console.log('Observation SNOMED Display: ' + global.obsDisplay[i]);
          console.log('Observation obsValueCode SNOMED CODE: ' + global.obsValueCode[i]);
          console.log('Observation obsValueDIsplay SNOMED Display: ' + global.obsValueDisplay[i]);
          console.log('Observation obsBodySiteCode SNOMED CODE: ' + global.obsBodySiteCode[i]);
          console.log('Observation obsBodySiteDisplay SNOMED Display: ' + global.obsBodySiteDisplay[i]);
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

    // Create an object containing the arrays
    const obsData = {
      obsCode: global.obsCode,
      obsDisplay: global.obsDisplay,
    };

console.log( obsData );

    res.render("Home", {  bundleProfile :  bundleProfile,
                          messageHeaderProfile: messageHeaderProfile, messageHeaderCode: messageHeaderCode, messageHeaderDesc: messageHeaderDesc,
                          patientProfile: patientProfile, patientNHS: patientNHS,
                          serviceRequestProfile: serviceRequestProfile, serviceRequestCode: serviceRequestCode, serviceRequestDesc: serviceRequestDesc,
                          specimenProfile: specimenProfile, specimenTypeCode: specimenTypeCode, specimenTypeDesc: specimenTypeDesc, 
                          specimenCollectedDateTime: specimenCollectedDateTime, specimenIdentifier: specimenIdentifier,
                          diagnosticReportProfile: diagnosticReportProfile, diagnosticReportCode: diagnosticReportCode, diagnosticReportDesc: diagnosticReportDesc,  
                          practitionerProfile: practitionerProfile, practitionerAddress: practitionerAddress, practitionerName: practitionerName,     
                          obsProfile: global.obsProfile, obsCode: global.obsCode, obsDisplay: global.obsDisplay,
                          obsBodySiteCode: global.obsBodySiteCode, obsBodySiteDisplay: global.obsBodySiteDisplay,
                          obsValueCode: global.obsValueCode, obsValueDisplay: global.obsValueDisplay
                        });

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});


});

app.listen(port, () => console.log("Server started and listening on port " + port ));
