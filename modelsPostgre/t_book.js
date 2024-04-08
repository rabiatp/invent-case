module.exports = function (sequelize, DataTypes) {
    return sequelize.define('t_book', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			field: 'id'
		},
        libraryID: {
            type: DataTypes.INTEGER,
            references: { 
                model: 't_library', 
                key: 'id' 
            },
            field: 'library_id'
        },
        name: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'name'
		},
        author: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'author'
		},
        title: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'title'
		},
        score: {
            type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			field: 'score'
		},
        //I need a reader to calculate the score.
        readerCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
			field: 'reader_count'
        },
        //To understand user activity
        isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'is_active'
		}
		
	}, {
		tableName: 't_book'
	});
}