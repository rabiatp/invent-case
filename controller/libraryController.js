let app;
let constants = require('../constants/constants');
let libraryLogic = require('../logic/libraryLogic');
let HttpStatus = constants.HttpStatus;

module.exports = function(application) {

    app = application

    app.post("/create_lib", function (req, res) {
        var insertObj = {
            name : req.body.name
        }
        return libraryLogic.libraryInsert(insertObj, function(data){
            return res.status(HttpStatus.OK).json(data)
        }, function (err) {
            return res.status(HttpStatus.BAD_REQUEST).json('library could not be registered');
        });
    });

    app.get("/user_list", function (req, res) {
        let libraryName = req.body.name;
        return libraryLogic.getUserList(libraryName, function (data) {
            return res.status(HttpStatus.OK).json(data);
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json("Error");
        })
    })

    app.get("/book_list", function (req, res) {
        let libraryName = req.body.name;
        return libraryLogic.getBookList(libraryName,  function (data) {
            return res.status(HttpStatus.OK).json(data);
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json("Error");
        })
    })

    app.post("/book_borrow_history", function(req, res){
        let obj = {
            userID: req.body.userID,
            name: req.body.name,
            author: req.body.author,
            userScore : req.body.userScore
        }
        return libraryLogic.bookBorrow(obj, function (data) {
            return res.status(HttpStatus.OK).json(data)
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })
    
}