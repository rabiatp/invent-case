let app;
let constants = require('../constants/constants');
const userLogic = require('../logic/userLogic');
let HttpStatus = constants.HttpStatus;
module.exports = function(application) {

    app = application

    app.post("/create_user", function (req, res) {
        var insertObj = {
            libraryName: JSON.stringify(req.body.libraryName).replace(/"/g, "'"),
            name : req.body.name,
            surname : req.body.surname,
        }
      //  insertObj.libraryName = tekTirnakCiftTirnaklaDegistir(insertObj.libraryName)
        return userLogic.userInsert(insertObj, function(data){
            return res.status(HttpStatus.OK).json(data)
        }, function (err) {
            return res.status(HttpStatus.BAD_REQUEST).json('library could not be registered');
        });
    });

    app.get("/user/:id", function(req, res) {
        let userID = parseInt(req.params.id); 
        return userLogic.getUser(userID, function (data) {
            return res.status(HttpStatus.OK).json(data)
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })

    app.post("/user_up/:id", function(req, res) {
        let updateObj = {
            userID : parseInt(req.params.id),
            updateData :req.body
        }
        return userLogic.updateUser(updateObj, function (data) {
            return res.status(HttpStatus.OK).json(data)
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })
    app.delete("/user/:id", function(req, res) {
        let deleteObj = {
            id : parseInt(req.params.id),
          
        }
        return userLogic.deleteUser(deleteObj, function (data) {
            return res.status(HttpStatus.OK).json(data)
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })
    
}