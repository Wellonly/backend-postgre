
export default function paymethod(sequelize, DataTypes) {
  const Paymethod = sequelize.define('paymethod', {
    priority: { //priority means: <=0: excluded ; >0: exposed to menu!
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    descript: {
      type: DataTypes.TEXT,
    },
    icon: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    calc: {
      type: DataTypes.TEXT,
    },
    images: {
      type: DataTypes.STRING,
    },
    template: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
  }, { underscored: true });

  return Paymethod;
};
