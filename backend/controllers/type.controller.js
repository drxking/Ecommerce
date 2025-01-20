const typeModel = require("../models/type.model")

module.exports.getSearchType = async (req, res) => {
    let query = req.query.type
    let regex = new RegExp(`^${query}`, 'i')
    let types = await typeModel.find({"name": regex}).limit(5)
    if (types.length > 0) {
        console.log(query)
        res.send({
            "message": "Type Found",
            "status": "success",
            "data": types
        })
    } else {
        res.send({
            "message": "Type Not Found",
            "status": "failed"
        })
    }
}