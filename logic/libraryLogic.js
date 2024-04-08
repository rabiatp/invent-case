const InsertModel = require('../OrmModels/insertModel');
const UpdateModel = require('../OrmModels/updateModel');
const BbHistoryModel = require('../logicModels/bbHistory')

const { Op } = require('sequelize');
let libraryLogic = {
    libraryInsert : function (insertData, thenFunc, errFunc){
        let libraryDetail = new InsertModel();
        libraryDetail.table = "t_library";
        libraryDetail.object = insertData;
        libraryDetail.err = function (err) {
            return errFunc(err)
        }
        libraryDetail.then = function (data) {
            return thenFunc('Your Data Has Been Saved Successfully');
        }
        return ormContanier.insert(libraryDetail.table, libraryDetail.object, libraryDetail.then, libraryDetail.err)
    },
    getUserList : function (libraryName, thenFunc, errFunc){
       
        let jsonFilter =  { [Op.and]: [{ name: { [Op.eq]: libraryName } }]};
        let getViewFilterQueryModel = {
            tableName: "t_library",
            JSONFilter: jsonFilter,
        };
        let libraryThenFunc = function (libraryData){
            let jsonFilter =  { [Op.and]: [{ id: { [Op.eq]: libraryData[0].id } }]};
            let getViewFilterQueryModel = {
                tableName: "v_user_list",
                JSONFilter: jsonFilter,
            };
            let userListThenFunc = function (data){
                let userListArray = [];
                for (let i = 0; i < data.length; i++) {
                    let userListObj = {
                        id : data[i].user_id,
                        name : data[i].name,
                        surname : data[i].surname
                    }
                    userListArray.push(userListObj)
                }
                return thenFunc(userListArray)
            }
            let userListErrFunc = function (err){
                return errFunc(err)
            }
            return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, userListThenFunc, userListErrFunc);
        }
        let libraryErrFunc = function (error) {
            return errFunc("The library name is wrong.");
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, libraryThenFunc, libraryErrFunc);
    },
    getBookList : function (libraryName, thenFunc, errFunc){
       
        let jsonFilter =  { [Op.and]: [{ name: { [Op.eq]: libraryName } }]};
        let getViewFilterQueryModel = {
            tableName: "t_library",
            JSONFilter: jsonFilter,
        };
        let libraryThenFunc = function (libraryData){
            let jsonFilter =  { [Op.and]: [{ id: { [Op.eq]: libraryData[0].id } }]};
            let getViewFilterQueryModel = {
                tableName: "v_book_list",
                JSONFilter: jsonFilter,
            };
            let bookListThenFunc = function (data){
                let userListArray = [];
                for (let i = 0; i < data.length; i++) {
                    let userListObj = {
                        id : data[i].user_id,
                        name : data[i].name,
                        author : data[i].author,
                        score :  data[i].score
                    }
                    userListArray.push(userListObj)
                }
                return thenFunc(userListArray)
            }
            let bookListErrFunc = function (err){
                return errFunc(err)
            }
            return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, bookListThenFunc, bookListErrFunc);
        }
        let libraryErrFunc = function (error) {
            return errFunc("The library name is wrong.");
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, libraryThenFunc, libraryErrFunc);
    },
    bookBorrow : function (obj, thenFunc, errFunc){
       

        let jsonFilter =  { [Op.and]: [
            { name: { [Op.eq]: obj.name } },
            { author: { [Op.eq]: obj.author } },
        ]};
        let getViewFilterQueryModel = {
            tableName: "t_book",
            JSONFilter: jsonFilter,
        };
        let bookThenFunc = function(bookData){
            const { ormContainer } = require('../helpers/ormContanier');

            if(!(bookData.length > 0)){
                return errFunc("Book not found")
            }
            return ormContainer.Transaction(function(tran){
                if(!bookData[0].is_active){
                    return errFunc("The book is not available for use. Choose another book.")
                }
                let score = obj.userScore + parseFloat(bookData[0].score);
                
                bookData[0].reader_count += 1;
                let averageScore = parseFloat( score / bookData[0].reader_count)

               
                let bookUpdate = new UpdateModel();
                bookUpdate.table = "t_book"
                bookUpdate.object = {score: averageScore, readerCount: bookData[0].reader_count}
                bookUpdate.where =  {id: { [Op.eq]: bookData[0].id} }

                bookUpdate.then = function(data){
                    let userJsonFilter =  { [Op.and]: [
                        { id: { [Op.eq]: obj.userID } }
                    ]};
                    let userGetViewFilterQueryModel = {
                        tableName: "t_user",
                        JSONFilter: userJsonFilter,
                    };
                    let userThenFunc = function(userData){
                        let bbHistoryArray = [];
                        let pastObj = {
                            name: bookData[0].name,
                            score: averageScore
                        }
                        let bb = new BbHistoryModel();
                        bb.bookID = bookData[0].id;
                        bb.userID = userData[0].id;
                        bb.past = pastObj
                        bbHistoryArray.push(bb);

                        let bbHistoryDetail = new InsertModel();
                        bbHistoryDetail.table = "t_bb_history";
                        bbHistoryDetail.object = bbHistoryArray;
                        bbHistoryDetail.then = function(data){
                            return thenFunc(data);
                        };
                        bbHistoryDetail.err = function(err){
                            return errFunc(err);
                        }
                        return ormContainer.bulkInsert(bbHistoryDetail.table, bbHistoryDetail.object, bbHistoryDetail.then, bbHistoryDetail.err)
                    }
                    let userErrFunc = function(err){
                        return errFunc(err)
                    }
                    return ormContainer.selectAndFilterByQuery(userGetViewFilterQueryModel, userThenFunc, userErrFunc)
                }  
                bookUpdate.err  = function(err){
                    return errFunc(err)
                }
                return ormContainer.Update(bookUpdate, tran)
            })
        }
        let bookErrFunc = function(err){
            return errFunc(err)
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, bookThenFunc, bookErrFunc);
    }
}
module.exports = libraryLogic;