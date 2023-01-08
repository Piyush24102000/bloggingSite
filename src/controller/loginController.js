const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")

const login = async function(req, res){
    try {
        
        const { email, password } = req.body
        const fetchData = await authorModel.findOne({ email: email, password: password })
        if (fetchData == null) return res.status(401).send({ status: false, msg: "Email or Password does'nt exists" })
        console.log(fetchData._id)
        let token = jwt.sign({ id: fetchData._id }, "this is my first project")
        res.header('x-api-key', token)
        res.status(200).send({ status: true, data: token })
    
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports = {login}