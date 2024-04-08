let app;
let constants = require('../constants/constants');
const bookLogic = require('../logic/bookLogic');
let HttpStatus = constants.HttpStatus;
module.exports = function(application) {

    app = application
    app.post("/create_book", function (req, res) {
        var insertObj = {
            libraryName : JSON.stringify(req.body.libraryName).replace(/"/g, "'"),
            name :req.body.name,
            title : req.body.title,
            author : req.body.author
        }
        return bookLogic.bookInsert(insertObj, function(data){
            return res.status(HttpStatus.OK).json(data)
        }, function (err) {
            return res.status(HttpStatus.BAD_REQUEST).json('library could not be registered');
        });
    });

    app.get("/book/:id", function(req, res) {
        let bookID = parseInt(req.params.id); 
        return bookLogic.getBook(bookID, function (data) {
            return res.status(HttpStatus.OK).json(data)
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })
    app.post("/book_up/:id", function(req, res) {
        let updateObj = {
            bookID : parseInt(req.params.id),
            updateData : req.body
        }
        return bookLogic.updateBook(updateObj, function (data) {
            return res.status(HttpStatus.OK).json("Data updated successfully")
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })
    app.delete("/book/:id", function(req, res) {
        let deleteObj = {
            id : parseInt(req.params.id),
        }
        return bookLogic.deleteBook(deleteObj, function (data) {
            return res.status(HttpStatus.OK).json(data)
        }, function (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        })
    })
}