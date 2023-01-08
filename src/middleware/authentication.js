const jwt = require("jsonwebtoken")
const auth = async function (req, res, next) {

    try {
        let header = req.headers['x-api-key']
        if (header) {
            let decode = jwt.verify(header, "this is my first project")
            req.id = decode.id //authorization
            next()
        }
        else {
            res.status(401).send({ msg: "x-api-key is required in header" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports = {auth}