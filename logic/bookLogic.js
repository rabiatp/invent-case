const InsertModel = require('../OrmModels/insertModel');
const { Op } = require('sequelize');

let bookLogic = {
    bookInsert : async function (insertData, thenFunc, errFunc) {
        let jsonFilter =  { [Op.and]: [{ name: { [Op.eq]: insertData.libraryName } }]};
        let getViewFilterQueryModel = {
            tableName: "t_library",
            JSONFilter: jsonFilter,
        };
        let libraryThenFunc =async  function(data){
            let controller = await bookLogic.bookController(insertData)
            if (controller){
                return errFunc("There is a book registered with this name")
            }
            let bookInsert = {
                libraryID : data[0].id,
                name : insertData.name,
                title : insertData.title,
                author : insertData.author,
                score : 0,
                readerCount : 0,
                isActive : true
            }

            let bookDetail = new InsertModel();
            bookDetail.table = "t_book";
            bookDetail.object = bookInsert;
          
            bookDetail.then = function (data){
                return thenFunc(data)
            }
            bookDetail.err = function(err){
                return errFunc(err)
            }
            return ormContanier.insert(bookDetail.table, bookDetail.object, bookDetail.then, bookDetail.err) 
        }
        let libraryErrFunc = function (error) {
            return errFunc("The library name is wrong.");
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, libraryThenFunc, libraryErrFunc)
    },

    bookController : async function(insertData){
        
        insertData.name = JSON.stringify(insertData.name).replace(/"/g, "'");
        insertData.author = JSON.stringify(insertData.author).replace(/"/g, "'");

        let jsonFilter =  { [Op.and]: [{ name: { [Op.eq]: insertData.name }}, {author : { [Op.eq]: insertData.author }}]};
        let getViewFilterQueryModel = {
            tableName: "t_book",
            JSONFilter: jsonFilter,
        };
        let bookThenFunc = function ( data) {
           
            return data.length > 0
        }
        let bookErrFunc = function(err){
            return err
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, bookThenFunc, bookErrFunc)
    },

    getBook : function(bookID, thenFunc, errFunc) {
        let jsonFilter =  { [Op.and]: [{ id: { [Op.eq]: bookID }}]};
        let getViewFilterQueryModel = {
            tableName: "t_book",
            JSONFilter: jsonFilter,
        };
        let bookThenFunc = function (data){
            return thenFunc(data);
        }
        let bookErrFunc = function (err){
            return errFunc("There are no registered book.");
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, bookThenFunc, bookErrFunc)
    },

    updateBook : function (updateObj, thenFunc, errFunc){
        const { ormContainer } = require('../helpers/ormContanier');

        return ormContainer.Transaction(function(tran){
            let update = new UpdateModel;
            update.table = "t_book";
            update.object = updateObj.updateData;
            update.where = {id : {[Op.eq] : updateObj.bookID}};
            update.then = function(data){
                return thenFunc("Data updated successfully");
            }
            update.err = function(error){
                return errFunc(error);
            }
            return ormContainer.Update(update, tran)
        },thenFunc, errFunc)
      
    },

    deleteBook : function (deleteObj, thenFunc, errFunc){
        const { ormContainer } = require('../helpers/ormContanier');

        return ormContainer.Transaction(function(tran){
            let deleteValue = {id : {[Op.eq] : deleteObj.id}};
            let query = new DeleteModel();
            query.table = "t_book";
            query.where = deleteObj.object
            query.then = function (data) {
                return thenFunc(data)
            }
            query.err = function (err){
                return errFunc(err)
            }

            return ormContainer.Delete(query, tran)
        },thenFunc, errFunc)
    }
}
module.exports = bookLogic;