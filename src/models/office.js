
export default function office(sequelize, DataTypes) {
  const Office = sequelize.define('office', {
    city_id: {
      type: DataTypes.INTEGER,
    },
    priority: { //priority means: <=0: excluded from storefront; >0: exposed on storefront on the position!
      type: DataTypes.INTEGER,
    },
    services: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    descript: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    worktime: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
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

  Office.associate = models => {
    Office.belongsTo(models.City);
  };

  return Office;
};
