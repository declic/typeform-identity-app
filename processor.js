const _ = require('lodash')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const request = require('request-promise')
const parseTypeFormResponse = require('./typeform_parser')
const createMemberAction = require('./member_action')

const program = require('commander');

program
  .description('import data from TypeForm')
  .action(() => {
    processTypeFormResponse()
      .then(() => process.exit())
      .catch((err) => process.exit(-1));
  });

program.parse(process.argv);

function processTypeFormResponse(lastToken) {
  const qs = {
    until: process.env.TYPEFORM_UNTIL,
    page_size: 300,
    before: lastToken,
    completed: true,
  };
  const headers = {
    "Authorization": `Bearer ${process.env.TYPEFORM_API_TOKEN}`,
  };
  return request({
    method: 'GET',
    uri: process.env.TYPEFORM_FORM_URL,
    headers,
    qs,
  }).then((results) => {
    const res = JSON.parse(results);
    const noResponses = res.total_items;
    console.log(`Processing ${noResponses} responses`);

    if (noResponses > 0) {
      const newLastToken =  _.last(res.items).token;
      return Promise.map(res.items, (item) => {
        const parsedResponse = parseTypeFormResponse(item);
        if (parsedResponse.email) {
          return createMemberAction(parsedResponse);
        }
      }).then((processed) => {
        return processTypeFormResponse(newLastToken)
      })
    }
  }).catch((err) => {
    console.log(err);
    throw err;
  });
}
