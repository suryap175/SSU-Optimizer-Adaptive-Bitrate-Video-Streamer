const path = require('path');
var express = require('express');
var ffmpeg = require('ffmpeg');
var uuid = require('uuid');

const app = express();
const spawn = require('child_process').spawn;
const fileupload= require("express-fileupload")

const client_file = req.files.fileToUpload;
    let upload =  client_file.name.replace(/\s+/g, ''); 
    let randomString = generateString(6);
    uploaded_file=randomString+upload;
    //file_name=file_name.trim();
    console.log("****UPLOADED FILE NAME: ",uploaded_file);

    client_file.mv("E:/Projects/SSUApplication/serverside/uploads/"+uploaded_file,(err,result)=>{
        if(err)
            throw err;
        res.send(
            {
                success:true,
                message:"file uploaded!"

            }
            );
    });

// extract data from manifest file
const file = xmlData.querySelectorAll("BaseURL")[0].textContent.toString();
const rep = xmlData.querySelectorAll("Representation");
const type = rep[0].getAttribute("mimeType");
const codecs = rep[0].getAttribute("codecs");
const width = rep[0].getAttribute("width");
const height = rep[0].getAttribute("height");
const bandwidth = rep[0].getAttribute("bandwidth");
const ini = xmlData.querySelectorAll("Initialization");
const initialization = ini[0].getAttribute("range");
const segments = xmlData.querySelectorAll("SegmentURL");
const segList = xmlData.querySelectorAll("SegmentList");
let segDuration = segList[0].getAttribute("duration");

const video_process=(input_file,output_file)=>{
        let cmd = 'ffmpeg';
        console.log(input_file,output_file);
        let args = [
            '-re',
            '-i', `${input_file}`, 
            '-map', '0',
            '-map', '0',
            '-c:a', 'aac', 
            '-c:v', 'libx264',
            '-b:v:1', '2000k',
            '-b:v:1', '1000k',
            '-b:v:2', '600k', 
            '-s:v:1', ' 848x480',
            '-s:v:2', '640x360',
            '-bf', '1',
            '-keyint_min', '120',
            '-g', '120',
            '-sc_threshold', '0',
            '-b_strategy', '0',
            '-ar:a:1', '22050',
            '-use_timeline', '1',
            '-single_file','1',
            '-use_template', '1',
            '-adaptation_sets', 'id=0,streams=0 id=1,streams=1 id=2,streams=2 id=3,streams=3',
            '-f', 'dash', `${output_file}`,
        ];
        
        let proc = spawn(cmd, args);
        
        //console logs
        proc.stdout.on('data', function(data) {
           // console.log(data);
});

// play all segment one by one if necessary
function setupVideo() {
    if (index < segments.length && videoEl.currentTime - lastTime >= segCheck) {
      const range = segments[index].getAttribute("mediaRange").toString();
      segCheck = (timeToDownload(range) * 0.8).toFixed(3);
      const segmentVideoBuffer = await fetch(url, {
        header: `Range: "bytes=${range}"`,
      });
      videoSource.appendBuffer(new Uint8Array(segmentVideoBuffer));
      segCheck = (timeToDownload(range) * 0.8).toFixed(3);
      lastTime = videoElement.currentTime;
    }
  }
    