const authorModel = require("../models/authorModel")
const { isValidString, isValidEmail, isValidPassword } = require("../validator/validator")

const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        const { fname, lname, title, email, password } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Request body is empty" })

        //////////////////////////// fname and lname validation///////////////////////////
        if (!fname) return res.status(400).send({ status: false, msg: "fname is required" });
        if (!lname) return res.status(400).send({ status: false, msg: "lname is required" });
        if (isValidString(fname) == false) return res.status(400).send({ status: false, msg: "please provide valid fname" })
        if (isValidString(lname) == false) return res.status(400).send({ status: false, msg: "please provide valid fname" })

        //////////////////////////// title validation///////////////////////////
        if (!title) return res.status(400).send({ status: false, msg: "title is required" });
        let titles = ["Mr", "Mrs", "Miss"]
        if (!titles.includes(title)) return res.status(400).send({ status: false, msg: "Please provide the title in these options - Mr || Mrs || Miss" })

        //////////////////////////// email validation///////////////////////////
        if (!email) return res.status(400).send({ status: false, msg: "email is required" });
        if (isValidEmail(email) == false) return res.status(400).send({ status: false, msg: "Please Enter valid email" })
        let uniqueEmail = await authorModel.findOne({ email: email })
        if (uniqueEmail) return res.status(400).send({ status: false, msg: "Email already exists" })

        //////////////////////////// password validation///////////////////////////
        if (!password) return res.status(400).send({ status: false, msg: "password is required" });
        if (isValidPassword(password) == false) return res.status(400).send({ status: false, msg: "Please Enter valid Password" })

        let authorData = await authorModel.create(data);
        return res.status(201).send({status:true,data:authorData})

    } catch (error) {
        return res.status(500).send({ status: false, msg: e.message })
    }
}
module.exports = { createAuthor }