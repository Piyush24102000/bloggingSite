const express = require('express')
const router = express.Router()
const blogController = require("../controller/blogController")
const authorController = require("../controller/authorController")
const loginController = require("../controller/loginController")
const authenticationMiddle = require("../middleware/authentication")
const authorizationMiddle = require("../middleware/authorization")

router.post('/authors',authorController.createAuthor)
router.post('/blogs',authenticationMiddle.auth,blogController.createBlog)

router.get('/blogs',authenticationMiddle.auth,blogController.getAllBlogs)
router.put('/blogs/:blogId',authenticationMiddle.auth,authorizationMiddle.auth,blogController.updateBlog)

router.delete('/blogs/:blogId',authenticationMiddle.auth,authorizationMiddle.auth,blogController.deleteBlog)
router.delete("/blogs",authenticationMiddle.auth,blogController.deleteBlogQuery);

router.post("/login",loginController.login)


module.exports = router