const Home = require('../models/home');
const fs = require('fs');

exports.getAddHome = (req, res, next) => {
  res.render('host/edit-home', { pageTitle: 'Add Home', currentPage: 'add-home', editing: false, isLoggedIn: req.session.isLoggedIn, user: req.session.user, });
}

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found");
      return res.redirect('host/host-home-list')
    }
    console.log(homeId, editing, home);
    res.render('host/edit-home', { home: home, pageTitle: 'Edit Your Home', currentPage: 'host-home', editing: editing, isLoggedIn: req.session.isLoggedIn, user: req.session.user,});
  })
}

exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, price, location, rating, description } = req.body;

    if (!req.file) {
      return res.status(422).send("No image provided");
    }

    const photo = '/uploads/' + req.file.filename;

    const home = new Home({
      houseName,
      price,
      location,
      rating,
      photo,
      description
    });

    await home.save();

    console.log('Home saved successfully');
    res.redirect('/host-homes-list');
  } catch (err) {
    console.error('Error while saving home:', err);
    next(err);
  }
};


exports.getHostHomes = (req, res, next) => {

  Home.find().then(registeredHomes => {
    res.render('host/host-home-list', { registeredHomes: registeredHomes, pageTitle: 'Host Home', currentPage: 'host-home', isLoggedIn: req.session.isLoggedIn, user: req.session.user,});
  })
}

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if(req.file){
      fs.unlink(home.photo, (err)=>{
        if(err){
          console.log("Error while deleting file", err)
        }
      });
      home.photo = req.file.path;
    }
    home.save().then((result) => {
      console.log('Home Updated', result);
    }).catch(err =>{
     console.log('Error while updating', err);
  })
  res.redirect('host-homes-list');
  }).catch(err =>{
    console.log('Error while finding home', err);
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log(homeId);
  Home.findByIdAndDelete(homeId).then(deleteHome => {
    console.log('Deleted home:', deleteHome)
    res.redirect('/host-homes-list');

  }).catch(error =>{
      console.log('error while delete file', error);
       res.redirect('/host-homes-list');
  })
};


