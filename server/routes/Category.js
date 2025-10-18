const express = require("express")
const router = express.Router()
const { auth, isAdmin } = require("../middlewares/auth")
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/Category")

// Category routes
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/getAllCategories", getAllCategories)
router.put("/updateCategory/:id", auth, isAdmin, updateCategory)
router.delete("/deleteCategory/:id", auth, isAdmin, deleteCategory)

module.exports = router
