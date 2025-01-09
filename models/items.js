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

    get formattedDate() {
      return this.createdAt.toISOString().split('T')[0]
    }
  }
  // Validasi disini
  Items.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Name is required"
            },
            notNull: {
                msg: "Name is required"
            },
        },
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Stock is required"
            },
            notNull: {
                msg: "Stock is required"
            },
        },
    }, 
    imageURL: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Image URL is required"
            },
            notNull: {
                msg: "Image URL is required"
            },
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: {
                msg: "Description is required"
            },
            notNull: {
                msg: "Description is required"
            },
        },
    },
    condition: {
        type: DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: {
                msg: "Condition is required"
            },
            notNull: {
                msg: "Condition is required"
            },
        },
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull : false,
        validate: {
            notNull: {
                msg: "Condition is required"
            },
        },
    },
    UserId: DataTypes.INTEGER
  }, {
    // Tambahin hooks disini
    hooks: {
      beforeCreate: (instance, options) => {
        // Buat validasi harga tidak boleh dibawah 0
        if (instance.price <= 0 ) {
          throw new Error('Price must be greater than 0')
        }
      }
    },
    sequelize,
    modelName: 'Items',
  });
  return Items;
};


