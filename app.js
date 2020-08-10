const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const apiKey = ""; //you need to insert your API key here
const serverID = ""; //insert your serverID, which is the same as the ending of your API key
const listID = ""; //the ID of Mailchimp list you are using 

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.email;

  const data = {
    members: [{
      email_address: emailAddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://" + serverID + ".api.mailchimp.com/3.0/lists/" + listID;
  const options = {
    method: "POST",
    auth: "Runyao:" + apiKey
  }

  const request = https.request(url, options, (response) => {
    const {
      statusCode
    } = response;
    // console.log(statusCode);
    if (statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  })
  request.write(jsonData);
  request.end();
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000.");
})
