var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
	var Model = sequelize.define('appClient', {
		name: { type: DataTypes.STRING, unique: true, allowNull: false },
		clientId: { type: DataTypes.INTEGER, primaryKey:true, unique: true, allowNull: false },
		clientSecret: { type: DataTypes.STRING, allowNull: false },
}, {
	tableName: 'appClient',
	classMethods: {
	associate: function(models) {

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