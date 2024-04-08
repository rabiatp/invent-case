const InsertModel = require('../OrmModels/insertModel');
const UpdateModel = require('../OrmModels/updateModel');
const DeleteModel = require('../OrmModels/deleteModel');
const UserModel = require('../logicModels/user')
const { Op } = require('sequelize');

let userLogic = {
    userInsert : function (insertData, thenFunc, errFunc){
        let jsonFilter =  { [Op.and]: [{ name: { [Op.eq]: insertData.libraryName } }]};
        let getViewFilterQueryModel = {
            tableName: "t_library",
            JSONFilter: jsonFilter,
        };
        let libraryThenFunc = function (data){

            let insertUser = {
                libraryID : data[0].id,
                name : insertData.name,
                surname : insertData.surname,
                isActive : true
            }
            let userDetail = new InsertModel();
            userDetail.table = "t_user";
            userDetail.object = insertUser;
            userDetail.err = function (err) {
                return errFunc(err)
            }
            userDetail.then = function (data) {
                return thenFunc('Your Data Has Been Saved Successfully');
            }
            return ormContanier.insert(userDetail.table, userDetail.object, userDetail.then, userDetail.err)
        }
        let libraryErrFunc = function (error) {
            return errFunc("The library name is wrong.");
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, libraryThenFunc, libraryErrFunc)

      
    },

    getUser : function (userID, thenFunc, errFunc){
        let jsonFilter = { [Op.and]: [{ id: { [Op.eq]:  userID} }]};
        let getViewFilterQueryModel = {
            tableName : "t_user",
            JSONFilter: jsonFilter,
        }
        let getUserThenFunc = function(data){
            return thenFunc (data)
        }
        let getUserErrFunc = function (err) {
            return errFunc("There are no registered users.")
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, getUserThenFunc, getUserErrFunc)
    },

    updateUser : function (updateObj, thenFunc, errFunc){
        //const ormContainer = require("../helpers/ormContanier")
        const { ormContainer } = require('../helpers/ormContanier');

        return ormContainer.Transaction(function(tran){

            let update = new UpdateModel;
            update.table = "t_user";
            update.object = updateObj.updateData;
            update.where = {id : {[Op.eq] : updateObj.userID}};
            update.then = function(data){
                return thenFunc(data);
            }
            update.err = function(error){
                return errFunc(error);
            }
            return ormContainer.Update(update, tran)
        }, thenFunc, errFunc)
      
    },

    deleteUser : function (deleteObj, thenFunc, errFunc){
        const { ormContainer } = require('../helpers/ormContanier');
      
        return ormContainer.Transaction(function(tran){
            let deleteValue = {id : {[Op.eq] : deleteObj.id}};

            let query = new DeleteModel();
            query.table = "t_user";
            query.where = deleteValue
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
module.exports = userLogic;