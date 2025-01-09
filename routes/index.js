const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")


//  todo ngarahin ke langsung ke homepage
router.get("/", Controller.goToHome)

// todo menampilkan home page
router.get("/home", Controller.home);
router.get("/categories", Controller.getAllCategory);
router.get("/categories/:id", Controller.getCategoryById);
router.get("/categories/:id/add",Controller.addItembyCategoryPage);
router.post("/categories/:id/add",Controller.addItembyCategoryData);
router.get("/itemsforsale", Controller.getAllItems);
router.get("/itemsforsale/categories/:id", Controller.getItemById);
router.get("/itemsforsale/categories/:id/add", Controller.addItemtoCategoryPage);
router.post("/itemsforsale/categories/:id/add", Controller.addItemtoCategoryData);
router.get("/itemsforsale/categories/:id/edit", Controller.editItemForm);
router.post("/itemsforsale/categories/:id/edit", Controller.editItemData);
router.get("/itemsforsale/categories/:id/delete", Controller.deleteItem);
router.post('/itemsforsale/:id/buy', Controller.buyItem);



module.exports = router;