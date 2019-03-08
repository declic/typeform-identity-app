# Integration of TypeForm with Identity

This app retrieves responses from TypeForm and registers them in Identity as member actions.

## Installation

This is a simple node app that has 2 main components:
 - a webhook that is triggered on a TypeForm form submit which processes the response instantly
 - a script executed on demand for processing historical responses

Clone the app. Using `node  >= v8.0.0` run:

```
npm install
```

Configure the env params:

```json

{
  "env": {
    "IDENTITY_URL": {
      "description": "URL to Identity API route for creating a member action"
    },
    "IDENTITY_API_TOKEN": {
      "description": "Authorization token from Identity"
    },
    "TYPEFORM_FORM_URL": {
      "description": "URL to the TypeForm form we download responses for"
    },
    "TYPEFORM_API_TOKEN": {
      "description": "Authorization token from TypeForm"
    },
    "MEMBER_ACTION_NAME": {
      "description": "Name of the action that will be recorded in Identity"
    },
    "MEMBER_ACTION_DESCRIPTION": {
      "description": "Description of the action that will be recorded in Identity"
    },
    "EMAIL_ID": {
      "description": "ID of the TypeForm's email field"
    },
    "FIRST_NAME_ID": {
      "description": "ID of the Typeform firstname field"
    },
    "LAST_NAME_ID": {
      "description": "ID of the TypeForm's lastname field"
    },
    "POSTCODE_ID": {
      "description": "ID of the TypeForm's postcode field"
    },
    "CONSENT_ID": {
      "description": "ID of the TypeForm's consent field"
    },
    "CONSENTED_TEXT": {
      "description": "The text of the answer in typeform that indicates a user has consented i.e. I accept"
    },
    "IDENTITY_CONSENT_PUBLIC_ID": {
      "description": "public id of the opt-in gdpr consent in identity"
    },
    "IDENTITY_PRIVACY_PUBLIC_ID": {
      "description": "public id of the implicit privacy consent in identity"
    }
  }
}
```

For example values see `.env.example`.

`EMAIL_ID`, `LAST_NAME_ID` etc. refer to the field ID of the TypeForm questions whose answers provide the required values. If a member with this email already exists in Identity, his/her details will be updated with these values and a new member action will be recorded.
If there is no member with the given email, it will be created with the new action as an entry point.

## Usage

To process the historical responses just use the following command with an optional ending time:

```
TYPEFORM_UNTIL=2018-09-18T06:46:36 node ./processors.js
```

To use the webhook you will have to deploy the app on Heroku, configure the env parameters and simply run:

```
npm start
```

Then using the new Heroku URL, you have to register your webhook on TypeForm [as described here](https://developer.typeform.com/webhooks/reference/create-or-update-webhook/).
If all goes well, every form answer that is submitted should turn into a record in Identity.
