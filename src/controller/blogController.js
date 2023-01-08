const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const { isValidString, isIdValid } = require("../validator/validator")

///////////////////Creating Blog///////////////////////
const createBlog = async function (req, res) {
    try {
        const data = req.body
        let id = data.authorId
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "request body is Empty" })
        const { title, body, authorId, category } = data

        if (!title) return res.status(400).send({
            status: false,
            msg: "title is required"
        });
        if (!body) return res.status(400).send({
            status: false,
            msg: "body is required"
        });
        if (!authorId) return res.status(400).send({
            status: false,
            msg: "authorId is required"
        });
        if (!category) return res.status(400).send({
            status: false,
            msg: "category is required"
        });

        if (!isValidString(title)) return res.status(400).send({ status: false, msg: "Please provide valid title" })
        if (!isValidString(body)) return res.status(400).send({ status: false, msg: "Please provide valid body" })
        if (!isValidString(category)) return res.status(400).send({ status: false, msg: "Please provide valid category" })
        if (!isIdValid(authorId)) return res.status(400).send({ status: false, msg: "Please provide valid authorId" })

        let authorData = await authorModel.findById(id);
        if (!authorData) return res.status(404).send({ status: false, msg: "Author Id does'nt exists" })

        let blogData = await blogModel.create(data)
        return res.status(201).send({ status: true, data: blogData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

///////////////////Get All Blogs///////////////////////
const getAllBlogs = async (req, res) => {
    try {
        let blogs = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true },req.query] })
        if (blogs) {
            res.status(200).send({ status: true, data: blogs })
        } else { res.status(404).send({ status: false, msg: "No Documents Found" }) }

    } catch (error) {
        return res.status(500).send({ status: false, msg: e.message })
    }
}

///////////////////Update Blogs by id///////////////////////
const updateBlog = async (req, res) => {
    try {
        let id = req.params.blogId
        if (!isIdValid(id)) return res.status(404).json({ status: false, msg: "Invaild blogId" })

        let checkId = await blogModel.findById(id)
        if (!checkId) return res.status(400).json({ status: false, msg: "This Blog id is not present in DB" })
        if (checkId.isDeleted == false) {
            let updateBlog = await blogModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        title: req.body.title,
                        body: req.body.body,
                        category: req.body.category,
                        publishedAt: Date.now(),
                        isPublished: true,
                        isDeleted: false,
                    },
                    $push: { tags: req.body.tags, subcategory: req.body.subcategory },
                },
                { new: true }
            )
            return res.status(200).send({ status: true, message: "Successfully updated", data: updateBlog })
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: e.message })
    }
}

///////////////////Delete Blogs by id///////////////////////
const deleteBlog = async (req, res) => {
    try {
        let id = req.params.blogId
        if (!isIdValid(id)) return res.status(404).json({ status: false, msg: "Invaild blogId" })

        let checkId = await blogModel.findById(id)
        if (!checkId) return res.status(400).json({ status: false, msg: "This Blog id is not present in DB" })

        if (checkId.isDeleted == false) {
            const blog = await blogModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
            if (blog) {
                res.status(200).send({ status: true })
            } else {
                res.status(404).send({ status: false, msg: `${req.params.blogId} id not found!` })
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: e.message })
    }
}

///////////////////Delete Blogs by Query///////////////////////
const deleteBlogQuery = async (req, res) => {
    try {
        let query = req.query
        let checkBlog = await blogModel.find(query) //array []
        if (checkBlog.length == 0) return res.status(404).send({ status: false, msg: "Blog not found " })

        let blogs = await blogModel.updateMany({ $and: [{ isDeleted: false }, { authorId: req.id }, query] }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        if (blogs.modifiedCount > 0) {
            res.status(200).send({ status: true, msg: "Successfully Deleted" })
        }
        else {
            res.status(404).send({ msg: "Blog is already deleted" })
        }
    }
    catch (e) {
        res.status(500).send({ status: false, msg: e.message })
    }
}

module.exports = { createBlog, getAllBlogs, updateBlog, deleteBlog, deleteBlogQuery }