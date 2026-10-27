const Home = require('../models/home');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
  console.log("session Value: ", req.session);
  Home.find().then(registeredHomes => {
    res.render('store/index', { registeredHomes: registeredHomes, pageTitle: 'Airbnb Home', currentPage: 'index', isLoggedIn: req.session.isLoggedIn, user: req.session.user});
  });
}

exports.getHomeList = (req, res, next) => {

  Home.find().then(registeredHomes => {
    res.render('store/home-list', { registeredHomes: registeredHomes, pageTitle: ' Home List', currentPage: 'home-list', isLoggedIn: req.session.isLoggedIn, user: req.session.user});
  })
}

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', { pageTitle: 'bookings', currentPage: 'bookings', isLoggedIn: req.session.isLoggedIn, user: req.session.user,});
}

exports.getHomeDetail = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("HOME ID:", homeId);
  Home.findById(homeId).then(home => {
    if (!home) {
      res.redirect("/homes");
    } else {
      console.log(home);
      res.render('store/home-detail', { home: home, pageTitle: 'home-detai;', currentPage: 'index', isLoggedIn: req.session.isLoggedIn, user: req.session.user,});

    }
  })
}

exports.getFavourites = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
      res.render('store/favourite-list', { pageTitle: 'favourites', currentPage: 'favourites', favouritesHomes: user.favourites, isLoggedIn: req.session.isLoggedIn, user: req.session.user,
     });
}


exports.postAddToFavourites = async(req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect('/favourites');
}


exports.postDeleteFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(user.favourites.includes(homeId)){
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
    res.redirect('/favourites');
}

