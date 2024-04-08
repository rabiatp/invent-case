module.exports = function (sequelize, DataTypes) {
    return sequelize.define('t_bb_history', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			field: 'id'
		},
        bookID: {
			type: DataTypes.INTEGER,
            references: { 
                model: 't_book', 
                key: 'id' 
            },
			field: 'book_id'
		},
        userID: {
			type: DataTypes.INTEGER,
            references: { 
                model: 't_user', 
                key: 'id' 
            },
			field: 'user_id'
		},
        past: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'past'
		},
        present: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'present'
		},

		
	}, {
		tableName: 't_bb_history'
	});
}