module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define('UserSettings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    selectedHouseholdId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'selected_household_id'
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: true
    }
  }, {
    tableName: 'user_settings',
    underscored: true,
    timestamps: true
  });
  
  UserSettings.associate = (models) => {
    UserSettings.belongsTo(models.User, { foreignKey: 'userId' });
  };
  
  return UserSettings;
};
