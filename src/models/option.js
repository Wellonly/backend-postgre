
export default function option(sequelize, DataTypes) {
  const Option = sequelize.define('option', {
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    group: {
      type: DataTypes.STRING(10),
    },
    datatype: {
      type: DataTypes.STRING(10),
    },
    value: {
      type: DataTypes.TEXT,
    },
    descript: {
      type: DataTypes.TEXT,
    },
  }, { underscored: true });

  return Option;
};
