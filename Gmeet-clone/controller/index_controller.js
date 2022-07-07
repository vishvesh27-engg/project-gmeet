const { v4: uuidv4 } = require('uuid'); //used to get unique room ids


module.exports.joinWhiteboard=function (req,res){
    return res.render("whiteboard",{ roomId: req.params.room })
}