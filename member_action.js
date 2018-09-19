const request = require('request-promise');

function createMemberAction(parsedForm) {
  const body = {
    "api_token": process.env.IDENTITY_API_TOKEN,
    "action_type": "typeform_survey",
    "action_technical_type": "typeform_survey",
    "create_dt": parsedForm.submitted_at,
    "action_name": process.env.MEMBER_ACTION_NAME,
    "external_id": parsedForm.form_id,
    "action_description": process.env.MEMBER_ACTION_DESCRIPTION,
    "cons_hash": {
      "firstname": parsedForm.firstname,
      "lastname": parsedForm.lastname,
      "emails": [
        {
          "email": parsedForm.email,
        }
      ],
      "addresses": [
        {
          "postcode": parsedForm.postcode,
        }
      ]
    },
  }
  return request({
    method: 'POST',
    uri: process.env.IDENTITY_URL,
    body,
    json: true,
  })
  .catch((err) => {
    console.log('Error from Identity', err);
    throw err;
  });
}

module.exports = createMemberAction;
