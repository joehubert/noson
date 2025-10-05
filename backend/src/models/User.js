module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sonosUserId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'sonos_user_id'
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      field: 'last_login'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });
  
  User.associate = (models) => {
    User.hasOne(models.Token, { 
      foreignKey: 'userId', 
      onDelete: 'CASCADE' 
    });
    User.hasOne(models.UserSettings, { 
      foreignKey: 'userId', 
      onDelete: 'CASCADE' 
    });
  };
  
  return User;
};
