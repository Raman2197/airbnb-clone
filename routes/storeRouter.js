const express = require('express');
const storeRouter = express.Router();
const homeController = require('../controller/store')

storeRouter.get("/",homeController.getIndex);
storeRouter.get("/bookings",homeController.getBookings);
storeRouter.get("/favourites",homeController.getFavourites);
storeRouter.post("/favourites",homeController.postAddToFavourites);
storeRouter.get("/home-list",homeController.getHomeList);
storeRouter.get("/homes/:homeId",homeController.getHomeDetail);
storeRouter.post("/delete/:homeId",homeController.postDeleteFavourites);



module.exports = storeRouter;