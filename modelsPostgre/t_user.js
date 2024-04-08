module.exports = function (sequelize, DataTypes) {
    return sequelize.define('t_user', {
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
        surname: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'surname'
		},
        //To understand user activity
        isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'is_active'
		}
		
	}, {
		tableName: 't_user'
	});
}