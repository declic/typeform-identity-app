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
    "consents": [
      {
        "public_id": process.env.IDENTITY_PRIVACY_PUBLIC_ID,
        "consent_level": "implicit",
        "consent_method": "implicit",
        "consent_method_option": null
      },
      {
        "public_id": process.env.IDENTITY_CONSENT_PUBLIC_ID,
        "consent_level": (parsedForm.consent === process.env.CONSENTED_TEXT ? 4 : 1),
        "consent_method": "radio_buttons",
        "consent_method_option": parsedForm.consent
      }
    ],
    "survey_responses": parsedForm.answers.map(answer =>
      ({
        question: {
          text: answer['text'],
          qtype: answer['type']
        },
        answer: answer['value']
      })
    )
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
