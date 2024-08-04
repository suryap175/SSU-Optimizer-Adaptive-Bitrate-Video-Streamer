/*importing Express*/
const express = require("express");
//a module with functions or objects or variables assigned to it

const bodyParser = require("body-parser");
//extracts the entire body portion of an incoming request stream and exposes it on request.
const ffmpeg = require("fluent-ffmpeg");
// for conversion 

const fs= require("fs");

/*Express file upload*/
const expressFileUpload = require("express-fileupload");
// for uploading file on server through/ from local machine

const app = express();
const PORT = process.env.PORT || 5000 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// allows to work on the operational functions
app.use(
    expressFileUpload({
      // using temp files method, and deleting the material content, once operated.
      useTempFiles: true,
      // tmp directory for storing the files on a temporary basis.
      tempFileDir: "/tmp/",
    })
  );
//configuring the ffmpeg library
ffmpeg.setFfmpegPath("C:/Program Files/ffmpeg-5.0-essentials_build/bin/ffmpeg.exe");

//configuring the ffmpeg fprobe path which allows to save the converted video.
ffmpeg.setFfprobePath("C:/Program Files/ffmpeg-5.0-essentials_build/bin");

//configuring the flvtool path for making use of converted files.
ffmpeg.setFlvtoolPath("C:/Program Files/ffmpeg-5.0-essentials_build/flvtool");

console.log(ffmpeg)

/* Will take request and response object*/
app.get('/',(req,res) => {
    res.sendfile(__dirname + '/index.html')
    // dirname is the directory name and index.html takes the reference.
})
//sending response back to serve
app.post('/convert', (req,res) => {
  // requesting to allow for the conversion from one extension to the other.
    let to =req.body.to;
    // requesting files from the html page which has name associated as file.
    let file =req.files.file;
    // for the final conversion of a video from one extension to other
    let fileName = `output.${to}`;
    // ${to} allows to redirect the uploaded video to finally convert it into a selected extension and then save of the local system.
    console.log(to);
    // allows to work with the conversion request.
    console.log(file);
    // allows to download the video after accepting the conversion request.

    file.mv("tmp/" + file.name, function (err) {
      // tmp folder for storing videos for the temporary process.
      if (err) return res.sendStatus(500).send(err);
      // returns error if occured.
      console.log("File Uploaded successfully");
      // displays a message if the file is successfully uploaded.
      // Here, the error is dispalyed, when one video is already being converted to some other extension, and 
      //during the process, another video is uploaded for the conversion request.
    });

    ffmpeg("tmp/" + file.name)
    // downloading of the conversion and deleting of the file from tmp folder, once the target is completed.
    .withOutputFormat(to)
    //selects the desired output extension for reducing the size of the video and saving it with reduced size and new extension.
    .on('end', function(stdout, stderr){
      console.log("Finished");
      // displays the message finished, once the process is comppleted and the file is successfully downloaded and converted.
      res.download(__dirname + fileName, function (err) {
        if (err) throw err;
        // throws an error, if occured.
        // Here, the error  can be of type if the code is already running in the vs code terminal, and again sent a request
        // to run on the cmd terminal. In this case, exceptional error occurs and then it has to be cleared from the task manager.

        fs.unlink(__dirname + fileName, function (err) {
          // fs.unlink  is used for deleting the file from the tmp folder.
          if (err) throw err;
          // exceptional case, if error occurs.
          console.log("File deleted for current operation.");
          // displays the message that the file is deleted for the current operation.
        });
      });

      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        // exceptional case, if error occurs.
       console.log("File deleted from tmp folder.");
       // displays the message that the file is deleted from the tmp operation.
      });
    })

    .on("error", function(err){
      // exceptional case, if error occurs.
      console.log("Error take place " + err.message);
      // displays the message illustrating why the file cannot be converted to a selected extension
      fs.unlink("tmp/" + file.name, function (err) {
        // once the error is occured, it terminated the operation and deletes the file from tmp folder.
        if (err) throw err;
        console.log("File deleted from tmp folder");
      });
    })
    .saveToFile(__dirname + fileName)
    // for saving the file including the directory name and fileName as it's (the downloaded file) name.
  });

  app.listen(PORT);
app.listen(4000, () => {
  // allows to run the operation on the locallost:4000
    console.log("App is listening on port 4000")
    // displays the message on the cmd terminal that the application (SSU tool) is running on the localhost:4000
})

/* comment begins

For multiple files, when working with videos on cloud.
const ffmpeg = require("fluent-ffmpeg");

const bodyParser = require("body-parser");

const fs = require("fs");

const fileUpload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

ffmpeg.setFfprobePath("C:/ffmpeg/bin");

ffmpeg.setFlvtoolPath("C:/flvtool");

console.log(ffmpeg);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/convert", (req, res) => {
  //res.contentType(`video/${to}`);
  //res.attachment(`output.${to}`

  let to = req.body.to;
  let file = req.files.file;
  let fileName = `output.${to}`;
  console.log(to);
  console.log(file);

  file.mv("tmp/" + file.name, function (err) {
    if (err) return res.sendStatus(500).send(err);
    console.log("File Uploaded successfully");
  });

  ffmpeg("tmp/" + file.name)
    .withOutputFormat(to)
    .on("end", function (stdout, stderr) {
      console.log("Finished");
      res.download(__dirname + fileName, function (err) {
        if (err) throw err;

        fs.unlink(__dirname + fileName, function (err) {
          if (err) throw err;
          console.log("File deleted");
        });
      });
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
    })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
    })
    .saveToFile(__dirname + fileName);
  //.pipe(res, { end: true });
});

app.listen(PORT);


// comment ends;
*/ 