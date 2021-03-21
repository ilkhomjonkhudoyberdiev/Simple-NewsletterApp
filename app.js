const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
 
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname));
 
mailchimp.setConfig({
  apiKey: "3aae203a0af25847ca996bde3789317a-us1",
  server: " https://us1.api.mailchimp.com/3.0/lists/50e5af2ff3"
 
});
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})
 
app.post("/", function(req, res){

  const listId = "50e5af2ff3";
  const subscribingUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
  };
 
  async function run() {
      try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
 
          console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
          );
 
          res.sendFile(__dirname + "/success.html");
      } catch (e) {
          res.sendFile(__dirname + "/failure.html");
          console.log(e)
      }
  }
 
  run();
})
 
app.post("/failure", function(req, res) {
  res.redirect("/");
})
process.on('uncaughtException', function (err) {
    console.log(err);
}); 
app.listen(process.env.PORT || 8000, function () {
  console.log("Server is running on port 3000")
});