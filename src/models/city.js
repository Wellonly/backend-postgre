
export default function city(sequelize, DataTypes) {
  const City = sequelize.define('city', {
    name: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    area: {
      type: DataTypes.STRING(30),
    },
    countryCode: {
      type: DataTypes.STRING(2),
    },
    phone: {
      type: DataTypes.INTEGER,
    },
    postal: {
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
  }, { underscored: true });

  City.associate = models => {
    City.hasMany(models.Office);
  };

  return City;
};
