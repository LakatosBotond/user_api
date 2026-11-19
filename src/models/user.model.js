const {DataTypes} = require('sequelize');
const sequelize = require('../db/sequelize');

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), allowNull: false, validate: {len: {args: [2, 100], msg: 'Name must be between 2 and 100 characters'}}},
    email: {type: DataTypes.STRING(150), allowNull:false, unique: true, validate: {isEmail: {msg: 'Must be a valid email address'}}},
    password: {type: DataTypes.STRING(255), allowNull: false},
    role: {type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user'}
},{
tablename: 'users',
timestamps: true, 
defaultScope: {attributes: {exclude: ['password']}},
scopes: {
    withPassword: {attributes: {}}

}
})

module.exports = User;