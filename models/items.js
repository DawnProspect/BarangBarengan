'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Items.hasMany(models.ItemCategories, {
        foreignKey: "ItemId"
      })
    }
  }
  // Validasi disini
  Items.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    imageURL: DataTypes.INTEGER,
    description: DataTypes.STRING,
    condition: DataTypes.STRING,
    price: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    // Tambahin hooks disini
    hooks: {
      beforeCreate: (instance, options) => {
      }
    },
    sequelize,
    modelName: 'Items',
  });
  return Items;
};