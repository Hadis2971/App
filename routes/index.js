const express = require("express"),
      router  = express.Router(),
      User = require("../models/user"),
      multer  = require("multer"),
      GridFsStorage = require("multer-gridfs-storage"),
      Grid = require("gridfs-stream"),
      path = require("path"),
      crypto = require("crypto"),
      mongoose = require("mongoose");
      

const mongoURI = "mongodb://localhost:27017/twitter_cone______";

let gfs;
var conn = mongoose.createConnection(mongoURI);
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("profileImageUpload");
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error_msg", "You Must First Login");
        res.redirect(303, "/users/login");
    }
}

router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index");
});

router.get("/image/:filename", (req, res) => {
    gfs.files.findOne({profilePrictureFilename: req.params.filename}, (err, file) => {
        if(err) throw err;
        else{
            if(file){
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            }
        }
    });
});

router.get("/user/:username", ensureAuthenticated, (req, res) => {
    User.findOne({username: req.params.username}, (err , user) => {
        if(err) throw err;
        else{
           res.render("index", {user:user});
        }
    });
}); 



module.exports = router;