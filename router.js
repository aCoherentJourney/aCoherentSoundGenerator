const express     = require("express");

// Routes
app.get("/", (req, res) => {

  res.render("index");

});


app.post("/upload", (req, res) => {

  uploadFile(req, res).then( (result) => {

    console.log("vor result")
    console.log(result)
    console.log("nach result")
    
  }).catch(function(err){
    console.log(err);
  })

}); // end of post upload
