let blogModel = require("../models/blogModel")
const auth = async function (req, res, next) {
    try {
        let id = req.id
        let userId = req.params.blogId

        const data = await blogModel.findById(userId)
        if (!data) return res.status(404).send({ status: false, msg: "Invalid blogId" })
        const authorId = data.authorId;

        if (id == authorId) {
            next()
        }
        else {
            return res.status(403).send({ status: false, msg: "Unauthorised author" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })

    }
}
module.exports = { auth }