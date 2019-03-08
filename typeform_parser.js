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
    answers: extractAnswers(response)
  }
}

function extractValueForFieldOfId(response, id, fieldKey) {
  const answerData = _.get(response, 'answers', []).filter(a => a.field.id === id);

  if (answerData.length != 1) {
    console.log('Found ' + answerData.length + 'answers with id: ' + id);
    return null;
  }

  return extractAnswers(answerData[0], fieldKey);
}

function extractAnswers(response) {
  const rawAnswerData = _.get(response, 'answers', []);

  return rawAnswerData.map(answer =>
    ({
      id: answer['field']['id'],
      type: answer['type'],
      value: extractAnswers(answer, answer['type'])
    })
  );
}

function extractAnswer(answerData, fieldKey) {
  let answer = answerData[fieldKey]

  if (fieldKey === 'choices') {
    return answer['labels'].join(',');
  }
  else if (fieldKey === 'choice') {
    return answer['label'];
  }

  return answer;
}

module.exports = parseTypeFormResponse;
