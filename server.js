const express = require('express')
const bodyParser = require('body-parser')
const parseTypeFormResponse = require('./typeform_parser')
const createMemberAction = require('./member_action')

const app = express()

app.use(bodyParser.json())

app.post("/", (req, res) => {
  const response = parseTypeFormResponse(req.body.form_response)
  console.log("webhook received", response)

  createMemberAction(response);
  res.end();
})

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`)
})
