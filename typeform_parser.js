const _ = require('lodash');

const mapOfFieldIds = {
  "email": process.env.EMAIL_ID,
  "firstname": process.env.FIRST_NAME_ID,
  "lastname": process.env.LAST_NAME_ID,
  "postcode": process.env.POSTCODE_ID,
  "consent": process.env.CONSENT_ID,
}

function parseTypeFormResponse(response) {
  return {
    form_id: response['form_id'],
    submitted_at: response['submitted_at'],
    email: extractValueForFieldOfId(response, mapOfFieldIds.email, "email"),
    firstname: extractValueForFieldOfId(response, mapOfFieldIds.firstname, "text"),
    lastname: extractValueForFieldOfId(response, mapOfFieldIds.lastname, "text"),
    postcode: extractValueForFieldOfId(response, mapOfFieldIds.postcode, "text"),
    consent: extractValueForFieldOfId(response, mapOfFieldIds.consent, "choice"),
  }
}

function extractValueForFieldOfId(response, id, fieldKey) {
  const answerData = _.get(response, 'answers', []).filter(a => a.field.id === id);

  if (answerData.length != 1) {
    console.log('Found ' + answerData.length + 'answers with id: ' + id);
    return null;
  }

  var answer = answerData[0][fieldKey]

  if (fieldKey === 'choices') {
    answer = answer['labels'].join(',');
  }
  if (fieldKey === 'choice') {
    answer = answer['label'];
  }

  return answer;
}

module.exports = parseTypeFormResponse;
