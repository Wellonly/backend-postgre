
export const operationNameLength = 64;
export const pathLength = 64;
export const remoteAddressLength = 32;
export const originLength = 32;

export default function log(sequelize, DataTypes) {
  const Log = sequelize.define('log', {
    uid: {
      type: DataTypes.INTEGER,
    },
    operationName: {
      type: DataTypes.STRING(operationNameLength),
    },
    path: {
      type: DataTypes.STRING(pathLength),
    },
    message: {
      type: DataTypes.TEXT,
    },
    remoteAddress: {
      type: DataTypes.STRING(remoteAddressLength),
    },
    origin: {
      type: DataTypes.STRING(originLength),
    },
    query: {
      type: DataTypes.TEXT,
    },
    variables: {
      type: DataTypes.JSON,
    },
  });

  // Log.associate = models => {
  //   Log.belongsTo(models.User);
  // };

  return Log;
};
