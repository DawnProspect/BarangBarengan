const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")


//  todo ngarahin ke langsung ke homepage
router.get("/", Controller.goToHome)

// todo menampilkan home page
router.get("/home", Controller.home) // munculin dua button yaitu button untuk login dan button untuk melihat barang apa saja yang dijual
router.get("/categories", Controller.getAllCategory)
router.get("/categories/:id", Controller.getCategoryById)
// todo menampilkan semua item yang dijual
router.get("/itemsforsale", Controller.getAllItems) // muncul sebagai tombol di homepage

// todo menampilkan details item (description, price, stock, dan nama penjual)
router.get("/itemsforsale/details", Controller.itemDetails)  // muncul di page all-items di bagian itemnya

// todo menampilkan form item baru dan menambahkan data item baru
router.get("/itemsforsale/add", Controller.addItemForm) // muncul di page all-items
router.post("/itemsforsale/add", Controller.addNewItem) // muncul di page all-items

// todo menampilkan form untuk edit data item dan mengupdate data item
router.get("/itemsforsale/edit", Controller.editItemForm) // muncul di page details-items
router.post("/itemsforsale/edit", Controller.editItem) // muncul di page details-items

// todo menampilkan data profiles beserta namanya
router.get("/profiles", Controller.getProfiles) // muncul di page home

// todo menampilkan detail profile user (bisa lihat nama, telpon, dan alamat)
router.get("/profiles/:userId", Controller.getProfilesById) // muncul di page profile

// todo menampilkan form untuk menambahkan profile/data user baru
router.get("/profiles/:userId/add", Controller.addProfileForm) // muncul di page profile
router.post("/profiles/:userId/add", Controller.addNewProfile) // muncul di page profile
// function isAdmin(req, res, next){
//     if(req.session.userId === 1){
//         next()
//     } else {
//         res.redirect("/profiles")
//     }
// }
// todo menampilkan form untuk edit data user dan mengupdate data user
router.get("/profiles/:userId/edit", Controller.editProfileForm) // muncul di page profile user
router.post("/profiles/:userId/edit", Controller.editProfile) // muncul di page profile user

// todo menghapus user id
router.get("/profiles/:userId/delete", Controller.deleteProfileById) // muncul di page profile

// todo menghapus item berdasarkan id
router.get("/itemsforsale/:itemId/delete", Controller.deleteItemById) // muncul delete di page items detail


module.exports = router;