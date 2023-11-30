# pathologytest
Read in Pathology FHIR bundle message and convert in to HTML  
Also decode base64 encoded PDF value (if present) and write PDF to local folder

Install the usual way

1) clone repository locally

2) install it

```
npm install
```

3) run it with default provided pathology FHIR example

```
node ./appjs
```

or 

```
nodemon ./app.js 
```

4) Or run it with another pathology FHIR example (needs to contain encoded PDF in Observation.presentedForm) placed into local \private\examples folder

```
node ./appjs pathology_example2.json
```

or 

```
nodemon ./app.js pathology_example2.json
```

If FHIR JSON file contains base64 encoded PDF, running application will decode value and write file to local \private\output folder 

5) Once app is running, access the rendered web page served from local Node.js Express server in e.g. your web browser at

```
http://localhost:3000/
```

FHIR bundles from here -> https://simplifier.net/guide/pathology-fhir-implementation-guide/Home/Build/How-to-Construct-a-Pathology-Test-Report-Bundle?version=0.1

Example:
https://simplifier.net/guide/pathology-fhir-implementation-guide/Home/FHIRAssets/AllAssets/All-Profiles/Examples/Bundles/HPV-Primary-Screening-Report?version=0.1

Handlebars tutorial
https://stackabuse.com/guide-to-handlebars-templating-engine-for-node/

NHS.uk front end library
https://nhsuk.github.io/nhsuk-frontend/
