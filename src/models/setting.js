
export default function setting(sequelize, DataTypes) {
  const Setting = sequelize.define('setting', {
    configuration: {
      type: DataTypes.JSON,
    },
  }, { underscored: true });

  return Setting;
};
