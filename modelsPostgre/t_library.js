module.exports = function (sequelize, DataTypes) {
    return sequelize.define('t_library', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			field: 'id'
		},
        name: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'name'
		
        }
	}, {
		tableName: 't_library'
	});
}