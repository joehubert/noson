module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'access_token'
      // Stored encrypted
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'refresh_token'
      // Stored encrypted
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at'
    },
    tokenType: {
      type: DataTypes.STRING,
      defaultValue: 'Bearer',
      field: 'token_type'
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'tokens',
    underscored: true,
    timestamps: true
  });
  
  Token.associate = (models) => {
    Token.belongsTo(models.User, { foreignKey: 'userId' });
  };
  
  return Token;
};
