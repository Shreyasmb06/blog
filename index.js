import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import {dirname} from "path";
import {fileURLToPath} from "url";
import path from "path";
var photo='';
const __dirname=dirname(fileURLToPath(import.meta.url));

const store=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        photo=file.fieldname + '-' + Date.now()+".jpg";
        cb(null,photo);
    }
});
const upload=multer({storage: store})
const app=express();
const port=3000;
var authorised=false
app.use(bodyParser.urlencoded({extended:true}));

function passcheck(req,res,next){
    if(req.body["username"]=="shreyas" && req.body["password"]=="1304"){
        authorised= true;
    }
    
    next();
}
app.use(passcheck);
app.get("/",(req,res)=>{
   res.render("index.ejs");
});

app.post("/check",(req,res)=>{
    if(authorised){
    res.render("main.ejs",{img:photo});
    }
    else{
     res.render("index.ejs");
    }
});
// Serve static files from the 'uploads' directory
app.use(express.static(path.join(__dirname, 'uploads/')));

app.post("/addfile",upload.single("image"),(req,res)=>{
    
      res.render("main.ejs",{img:photo});
});

app.get("/reddit.ejs",(req,res)=>{
    
    res.render("reddit.ejs");
});
app.get("/bestesssay.ejs",(req,res)=>{
    
    res.render("bestesssay.ejs");
});

app.post('/uploads', upload.array('image'), (req, res) => {
    // Array of uploaded files
    const uploadedFiles = req.files;

    // Construct URLs for uploaded images
    const imageUrls = uploadedFiles.map(file => `/${file.filename}`);
   

    // Respond with JSON array of image URLs
    res.redirect("main.ejs");
});

app.listen(port,()=>{
    console.log("port is running");
});