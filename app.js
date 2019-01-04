// Requirements
const express     = require("express");
const bodyParser  = require("body-parser");
const path        = require("path");
const multer      = require("multer");
// const csv         = require("csv");
const csv         = require("csvtojson")
const fs          = require("fs");
const lineReader  = require("readline");


// const upload      = require("express-fileupload");


// Initialize app
const app = express();

// View engine
app.set("view engine", "ejs");

// Set views folder
app.set("views", path.join(__dirname, "views"));

// Set static path
app.use(express.static(path.join(__dirname, "/public")));

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function(req, file, cb){
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single("file");

// Check file type
function checkFileType(file, cb){
  // Allowed extensions
  const filetypes = /txt|csv|tab|png|json/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if(extname){
    return cb(null, true)
  } else{
    cb("Error: Text data files only");
  }
}

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

 

function csvToJson(filepath){

  // Convert a csv file with csvtojson
  let data = csv()
    .fromFile(filepath)
    .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
      console.log(jsonArrayObj); 
    });
}

function csvSize(filepath){

  let csv = csvToJson(filepath);
  let csvSize = csv.length;

  console.log(csvSize);
  return csvSize;

}



// Routes
app.get("/", (req, res) => {

  res.render("index");

});


app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if(err){
      // console.log(req.file);
      res.render("index", {
        msg: err
      });
    } else{
      
      // console.log(req.file.path);
      csvToJson(req.file.path)
      // csvSize(req.file.path)

      res.render("analysis", {
        msg: "File upload was successful",
        filename: req.file.originalname,
        encoding:  req.file.encoding,
        mimetype: req.file.mimetype,
        path: req.file.path   
      });

      

    }
  });
});


// Start server
app.listen(3000, function(){
  console.log("Server started on port 3000.")
});