# pathologytest
Read in Pathology FHIR bundle message and convert in to HTML

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

4) run it with another pathology FHIR example placed into local \public\examples folder

```
node ./appjs pathology_example2.json
```

or 

```
nodemon ./app.js pathology_example2.json
```


FHIR bundles from here -> https://simplifier.net/guide/pathology-fhir-implementation-guide/Home/Build/How-to-Construct-a-Pathology-Test-Report-Bundle?version=0.1

Example:
https://simplifier.net/guide/pathology-fhir-implementation-guide/Home/Examples/All-Examples/R4-Examples/HPV-Primary-Screening-Report?version=0.1

Handlebars tutorial
https://stackabuse.com/guide-to-handlebars-templating-engine-for-node/

NHS.uk front end library
https://nhsuk.github.io/nhsuk-frontend/