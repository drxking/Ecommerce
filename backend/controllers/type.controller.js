const typeModel = require("../models/type.model")

module.exports.getSearchType = async (req, res) => {
    try {
        let query = req.query.type
        let regex = new RegExp(`^${query}`, 'i')
        let types = await typeModel.find({ "name": regex }).limit(5)
        if (types.length > 0) {
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
    } catch (err) {
        console.log(err)
    }
}

module.exports.addType = async (req,res) =>{
    try{
        let {category} = req.body;
        let type = await typeModel.findOne({name:category})
        if(type){
            res.send({
                "message":"Type Already Exists",
                "status":"failed", 
            })
        }
        else{
            type = await typeModel.create({name:category})
            res.send({
                "message":"Type Created Successfully",
                "status":"success",
                "data":type
            })
        }

    }catch(err){
        console.log(err)
    }
}