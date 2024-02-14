const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Admin extends Model {
    static associate(models) {
      // define association here
      Admin.belongsTo(models.Company, { foreignKey: "companyId" });
        Admin.belongsTo(models.SuperAdmin, { foreignKey: "createdBy" });
    }
  }

  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin", // Default role for admins
      },
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );

  return Admin;
};
