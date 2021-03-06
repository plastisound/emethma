var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var Model = sequelize.define('refreshToken', {
		userId: { type: DataTypes.INTEGER, allowNull: false }, 
		clientId: { type: DataTypes.STRING, allowNull: false }, 
		token: { type: DataTypes.STRING, unique: true, allowNull: false }, 
		createdAt: { type: DataTypes.DATE, defaultValue: sequelize.NOW }
}, {
	tableName: 'refreshToken',
	classMethods: {
	associate: function(models) {
		  //Usuario.hasMany(models.Task)
		}
	},
	instanceMethods:{
	},
	getterMethods:{
	},
	setterMethods:{
	}
})

return Model
}