
// User xml2js library
var xml2js = require('xml2js');

// Extra options to handle soap envelope
var options = {
  explicitArray: false, 
  tagNameProcessors: [xml2js.processors.stripPrefix]
  };

// Value to be extracted from the request XML
var domainValue;

// Request XML
var requestXml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<soap:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
    <soap:Header/>
    <soap:Body optional="abc">
        <Root>
            <domain>Testing</domain>
        </Root>
    </soap:Body>
</soap:Envelope>
`;

// Response XML template
var responseXmlTemplate = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<soap:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
    <soap:Header/>
    <soap:Body optional="abc">
        <Root>
            <domain>Vinay</domain>
        </Root>
    </soap:Body>
</soap:Envelope>
`;

// Soap envelope template
var soapEnvlopeTeampalte = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<soap:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
    <soap:Header/>
    <soap:Body optional="abc">
    </soap:Body>
</soap:Envelope>
`;

var finalResponseObj;

var rootResonseObj;


// First parse the request XML to exract data
xml2js.parseString(requestXml, options, function (err, result) {
    domainValue = result.Envelope.Body.Root.domain;
});

// Parse response XML to modify the value
xml2js.parseString(responseXmlTemplate, options, function (err, result) {
    rootResonseObj = result.Envelope.Body;
    rootResonseObj.Root.domain = domainValue;
});

// Parse the soap envelope temlpate without extra options
xml2js.parseString(soapEnvlopeTeampalte, function (err, result) {
    finalResponseObj = result;
});

// Assign body of the modified XML to final response object
finalResponseObj['soap:Envelope']['soap:Body'] = rootResonseObj;
 
var builder = new xml2js.Builder();

out = builder.buildObject(finalResponseObj);

console.log(out);
