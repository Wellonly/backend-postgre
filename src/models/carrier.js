
export default function carrier(sequelize, DataTypes) {
  const Carrier = sequelize.define('carrier', {
    priority: { //priority means: <=0: excluded ; >0: exposed to menu!
      // it also select a form: 1: DeliveryBySelf; 2:DeliveryByCourier; 3:DeliveryByPost; >=4:DeliveryByCarrier
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

  return Carrier;
};
