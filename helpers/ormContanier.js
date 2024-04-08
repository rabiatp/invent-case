function connection(){
    const { Sequelize, DataTypes } = require('sequelize');
    const dbConfig = require("../config/db.config"); 
    
    const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
      
        pool: {
          max: dbConfig.pool.max,
          min: dbConfig.pool.min,
          acquire: dbConfig.pool.acquire,
          idle: dbConfig.pool.idle
        },
        define: {
            timestamps: false
          },
          options: {
            encrypt: false,
            trustServerCertificate: true,
          }
    });
    
    sequelize.authenticate()
      .then(() => {
        sequelizeModels.tableName = {
            't_user' : require('../modelsPostgre/t_user')(sequelize, DataTypes),
            't_library' : require('../modelsPostgre/t_library')(sequelize, DataTypes),
            't_book' : require('../modelsPostgre/t_book')(sequelize, DataTypes),
            't_bb_history' : require('../modelsPostgre/t_bb_history')(sequelize, DataTypes),
          
        }
       
      })
      .catch((err) => {
        console.error('Veritabanı senkronizasyonu başarısız:', err.message);
      });

    return sequelize;
}
function tranControl(tran,errFunc) {
    if (tran != undefined) {
        if(typeof tran.id !='string'){
            return errFunc("transaction function not found")// transaction dışarda tanımlanacak
        }
    }
}
const { Op } = require('sequelize'); 


let ormContainer = {

    insert: function(tableName, object, thenFunc, errFunc) {
       
        sequelize.transaction().then(t => {
            return sequelizeModels.tableName[tableName].create(object, { transaction: t })
                .then((data) => {
                     t.commit();
                    return thenFunc(data.dataValues);
                })
                .catch((error) => {
                    t.rollback();
                    return errFunc(error);
                });
        });
    },
    Transaction : function (transactionalFunc, thenFunc, exceptionFunc) {
        const Sequelize = require('sequelize');
        return sequelize.transaction({
          autocommit: false,
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        }, transactionalFunc).then((result) => {
          if (thenFunc != undefined) return thenFunc(result);
          return true;
        }).catch((err) => {
          if (exceptionFunc != undefined) return exceptionFunc(err);
          
          console.error(err)
          return false;
        });
    },
    bulkInsert: function(tableName, object, thenFunc, errFunc){
       
        sequelize.transaction().then(t => {
            return sequelizeModels.tableName[tableName].bulkCreate(object, { transaction: t })
                .then((data) => {
                    let returnData = [];
                    for (let i = 0; i < data.length; i++) {
                        returnData[i] = data[i].dataValues;
                    }
                     t.commit();
                    return thenFunc(returnData);
                })
                .catch((error) => {
                    t.rollback();
                    return errFunc(error);
                });
        });
    },
    selectAndFilterByQuery: async  function (getViewFilterQueryModel, thenFunc, errFunc) {
        try {
            const andSelectRows = getViewFilterQueryModel.JSONFilter[Op.and].map((condition) => {
                const column = Object.keys(condition)[0];
                let sqlOperator = '';
                let sqlValue = '';
            
                switch (Object.getOwnPropertySymbols(condition[column])[0]) {
                    case Op.eq:
                        sqlOperator = '=';
                        sqlValue = condition[column][Op.eq];
                        break;
                    case Op.in:
                        sqlOperator = 'IN';
                        sqlValue = condition[column][Op.in].join(', ');
                        break;
                    case Op.lte:
                        sqlOperator = '<=';
                        sqlValue = condition[column][Op.lte];
                        break;
                    case Op.gte:
                        sqlOperator = '>=';
                        sqlValue = condition[column][Op.gte];
                        break;
                    default:
                        // Bilinmeyen bir operatör varsa hata fırlatın veya varsayılan bir işlem yapın.
                        return errFunc(`Bilinmeyen operatör: ${Object.keys(condition[column])[0]}`);
                        
                }
            
                return `${column} ${sqlOperator} ${sqlValue}`;
              });
            
                const querySelect = `SELECT * FROM ${getViewFilterQueryModel.tableName}`;
                const queryWhere = andSelectRows.join(' AND '); // Koşulları AND ile birleştiriyoruz
                
                const sqlQuery= `${querySelect} WHERE ${queryWhere}`;
                returnData=  await sequelize.query(sqlQuery)
      
                if(thenFunc == undefined){
                  return returnData
                }
                return thenFunc(returnData[0])
        } catch (error) {
            return errFunc(error)
        }
      
    },
    updateTable : function(tablesName, updateObject, jsonfilterContent, thenFunc, errFunc, tran){
        tranControl(tran,errFunc);
        query.table = tablesName
        query.object = updateObject
        query.where = jsonfilterContent
        query.err = errFunc
        query.then = function (returnData) {
            return thenFunc(returnData, tran)        
        }
        query.err = function(errorData) {
            return errFunc(errorData)
        }
        return ormContainer.Update(query, tran);
    },
    Update : function(updateObj, tran){
        let tableName = updateObj.table;
        let object = updateObj.object;
        let wherePart = updateObj.where;
        let thenFunc = updateObj.then;
        let errFunc = updateObj.err;

        sequelize.transaction().then(t => {
            return sequelizeModels.tableName[tableName].update(object, { 
                where: wherePart,
                transaction: t
            })
                .then((data) => {
                     t.commit();
                    return thenFunc(data.dataValues);
                })
                .catch((error) => {
                    t.rollback();
                    return errFunc(error);
                });
        });
    },
    deleteTable : function(tablesName, jsonfilterContent, thenFunc, errFunc, tran){
        tranControl(tran,errFunc);
            let query = new DeleteModel();
            query.table = containerName
            query.where = mainFilter
            query.then = function () {
                return thenFunc("Your Data Has Been Successfully Deleted")
            }
            query.err = function(errorData) {
                return errFunc(errorData)
            }
            return ormContainer.Delete(query, tran);
        
    },
    Delete : function(deleteObj, tran){
        let tableName = deleteObj.table;
        let wherePart = deleteObj.where;
        let thenFunc = deleteObj.then;
        let errFunc = deleteObj.err;
       // let t = tran;
        sequelize.transaction().then(t => {
            return sequelizeModels.tableName[tableName].destroy({
                where: wherePart,
                transaction: t
            }).then((data) => {
                t.commit();
               return thenFunc(data.dataValues);
           })
           .catch((error) => {
               t.rollback();
               return errFunc(error);
           });
        })
       
    }
};

module.exports = {ormContainer, connection, tranControl};


