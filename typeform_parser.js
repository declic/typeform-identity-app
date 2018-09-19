const _ = require('lodash');

const mapOfFieldIds = {
  "email": process.env.EMAIL_ID,
  "firstname": process.env.FIRST_NAME_ID,
  "lastname": process.env.LAST_NAME_ID,
  "postcode": process.env.POSTCODE_ID,
}

function parseTypeFormResponse(response) {
  return {
    email: extractValueForFieldOfId(response, mapOfFieldIds.email, "email"),
    firstname: extractValueForFieldOfId(response, mapOfFieldIds.firstname, "text"),
    lastname: extractValueForFieldOfId(response, mapOfFieldIds.lastname, "text"),
    postcode: extractValueForFieldOfId(response, mapOfFieldIds.postcode, "text"),
  }
}

function extractValueForFieldOfId(response, id, fieldKey) {
  const answer = _.get(response, 'answers', []).filter(a => a.field.id === id);
  return answer.length == 1 ? answer[0][fieldKey] : null;
}

module.exports = parseTypeFormResponse;
