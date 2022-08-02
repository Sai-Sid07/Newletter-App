const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const APIKey = "ec47e5e4290028fb5e8c11ee23df48a3-us17"
const listID = "e9e1b9485d"
const https = require('https');
const { response } = require('express');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }))

// app.get("/signup", function (req, res) {
//     res.sendFile("signup.html", {root:__dirname})
// })

app.get("/", function(req, res){
    res.sendFile("index.html", {root:__dirname})
})

app.post("/", function(req,res){
    res.sendFile("signup.html", {root:__dirname})
})

app.post("/signup", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const eMail = req.body.eMail;
    const data = {
        members : [
            {
                email_address: eMail,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const dataJSON = JSON.stringify(data);

    const URL = "https://us17.api.mailchimp.com/3.0/lists/" + listID
    //The number after US is from your personal API key

    const option = {
        method:"POST",
        auth: "SaiSid:" + APIKey
    }

    const request = https.request(URL, option, function(response){
        
        if(response.statusCode === 200 || response.status === 200){
            res.sendFile("success.html", {root:__dirname});
        }
        else{
            res.sendFile("failure.html", {root:__dirname});
        }
        response.on("data", function(data){
            console.log("Data Sent");
        })
        console.log(response)
    })
    request.write(dataJSON)
    request.end()

})

app.post("/success", function(req, res){
    res.redirect("/")
})

app.post("/failure", function(req, res){
    res.redirect("/")
})

//process.env.PORT -> Dynamically chooses a port so that it can work with Heroku's server
app.listen(process.env.PORT || port, function(){
    console.log("Server Started Successfully");
})

