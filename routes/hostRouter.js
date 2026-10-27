const express = require('express');
const hostRouter = express.Router();

const homeController = require('../controller/host')

hostRouter.get("/add-home",homeController.getAddHome);
hostRouter.post("/add-home", homeController.postAddHome);
hostRouter.get("/host-homes-list", homeController.getHostHomes);
hostRouter.get("/edit-home/:homeId",homeController.getEditHome);
hostRouter.post("/edit-home",homeController.postEditHome);
hostRouter.post("/delete-home/:homeId",homeController.postDeleteHome);

exports.hostRouter = hostRouter;
