const path = require('path');
var express = require('express');
var ffmpeg = require('ffmpeg');
var uuid = require('uuid');

const app = express();
const spawn = require('child_process').spawn;
const fileupload= require("express-fileupload")

var fs = require('fs');

// Importing MySQL module
const mysql = require("mysql");

//app.set('title', 'SSU OPTIISER')

// Creating connection
let db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ssu optimiser"
});

let allowCrossDomain = function (req, res, next) {
    console.log("making all origin true")
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}

app.use(allowCrossDomain);
app.use(fileupload())

app.get("/get_video_metadata", (req, res) => {
    // this endpoint gets all table data of videos from mysql.

    let table_name = "videos"
    let sql = `select * from ${table_name}`

    console.log(db_con.state)
    if (db_con.state === 'disconnected') {
        db_con.connect((err) => {
            if (err) console.error('Error 😒: ', err)
            else console.log("connection established 😃")
            db_con.query(sql, (err, results) => {
                if (err) return err
                res.send(results)
            })
        })

    } else {
        db_con.query(sql, (err, results) => {
            if (err) return err
            res.send(results)
        })
    }
})


app.post("/upload",function(req,res,next) {
    const client_file = req.files.fileToUpload;
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
    
    //insert details into database
    let manifest_file_name="mds/"+manifest_name+"/out.mpd";
    //console.log("MESSAGE: @@@",manifest_file_name);
    let video_title = client_file.name.replace('.mp4',"");
    insertRecords(uid,video_title,uploaded_file,"http://127.0.0.1:5500/serverside/uploads/"+uploaded_file,manifest_file_name);
    //let url = generateUrl(manifest_name);
    //console.log(url);
});


//to create directory dynamically
function createDirectory(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}


//database connect
function insertRecords(video_title,manifest_file_name){
    if (db_con.state === 'disconnected') {
        db_con.connect((err) => {
            if (err)
             console.error('Error 😒: ', err)
            else
             console.log("connection established 😃")
            var sql="INSERT INTO videos(file_name,file_type,location,manifest_file_name) VALUE ?";
            //program checks the extension of media file
            var values=[
            [file_name,'MP4',location,manifest_file_name]
            ]
            db_con.query(sql,[values],function(err,results){ 
            });
        });
    }
    else {
        var sql="INSERT INTO videosfile_name,file_type,location,manifest_file_name) VALUE ?";
        //program checks the extension of media file
        var values=[
            [uid,video_title,file_name,'MP4',location,manifest_file_name]
        ]
        db_con.query(sql,[values],function(err,results){ 
        });
    }
}
 
    
app.listen(3000,()=>{
    console.log("Started on port:3000");
    
});