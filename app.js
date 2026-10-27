const express = require('express');
const app = express();

require('dotenv').config();


const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const mongoose = require('mongoose');
const DB_PATH = process.env.DB_PATH;

const rootDir = require('./Utils/pathUtils');

const errorController = require('./controller/error')
const storeRouter = require('./routes/storeRouter');
const {hostRouter} = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter')
const bodyParser = require('body-parser');



app.set('view engine', 'ejs');
app.set('views', 'views');


const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
})

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null,  path.join(rootDir, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
})


const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true);
  } else {
    cb(null, false);
  }
}


const multerOptions = {
 storage, fileFilter
};



app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded());
app.use(multer(multerOptions).single('photo'));
app.use("/uploads", express.static(path.join(rootDir, 'uploads')));
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')));
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')));




app.use(session({
  secret:  process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(authRouter);
app.use((req, res, next)=>{
  if(req.session.isLoggedIn){
    next();
  }else{
    res.redirect("/login")
  }
})

app.use(storeRouter);

app.use(hostRouter);

app.use(errorController.pageNotFound)

const Port = 4001;



mongoose.connect(DB_PATH).then(()=>{
  console.log('connected to mongodb');
app.listen(Port, () => {
  console.log(`Server listen on this address http://localhost: ${Port}`);
});
}).catch(err =>{
  console.log('Error while connected to mongo: ', err)
});




