/*importing Express*/
// require is used to as import factor
const express = require("express");
//a module with functions or objects or variables assigned to it
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
  // dirname is the directory name and index.html takes the reference.
});

app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    // not valid case
    res.status(400).send("Requires Range header");
    // illustrates that range header is mandatory 
  }

  // get video stats (about 61MB)
  const videoPath = "bigbuck.mp4";
  // selected video for the streaming
  const videoSize = fs.statSync("bigbuck.mp4").size;
  // selectes the specific or the total size of the video

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  // creates variables 
  const start = Number(range.replace(/\D/g, ""));
  // removes any letter or constants
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  // depends on the video factor

  // Create headers
  const contentLength = end - start + 1;
  // identifies the start and the end point of the video to be streamed on local host 8000
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    // start and end point target
    "Accept-Ranges": "bytes",
    // range
    "Content-Length": contentLength,
    // illustrates the length size of the video
    "Content-Type": "video/mp4",
    // video/mp4 because the video that is being used has an extension of mp4
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);
  // partial content creation based on the size 

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
  // passage of the video from initial to destination
});

app.listen(8000, function () {
  // selected port 8000
  console.log("Listening on port 8000!");
  // console is used as print/ operational command
});

function loaded()
{
    var size = 4096; // video size
    var v = document.getElementById('videoPlayer');
    var r = v.buffered;
    var total = v.duration;

    var start = r.start(0);
    var end = r.end(0);
    var percentDownloaded = (end/total)*100;
    var percentOfSize = (size/100)*percentDownloaded;

    console.log(percentOfSize);
}   

$('#videoID').bind('progress', function() 
{
    loaded();
}
);