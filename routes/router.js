const express = require("express");
const router = new express.Router();
const cors=require('cors')
const controllers = require("../controllers/allControllers");

router.post("/login",controllers.userlogin)
router.post("/register",controllers.userReg)
router.post("/add-owner",controllers.addOwner)
router.get("/owners",controllers.getOwners)
router.delete("/owners/:name/:address",controllers.delOwner)
router.put("/owners/:name/:address",controllers.editOwner)
router.post("/add-land",controllers.addLand)
router.get("/landholdings",controllers.getLand)
router.delete("/landholdings/:name",controllers.delLand)
router.put("/landholdings/:name",controllers.editLand)
module.exports=router