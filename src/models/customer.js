
export default function customer(sequelize, DataTypes) {
  const Customer = sequelize.define('customer', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notEmpty: true,
      // },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.STRING,
    },
    zipcode: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    birthday: {
      type: DataTypes.STRING,
    },
    first_seen: {
      type: DataTypes.DATE,
    },
    last_seen: {
      type: DataTypes.DATE,
    },
    has_ordered: {
      type: DataTypes.BOOLEAN,
    },
    latest_purchase: {
      type: DataTypes.STRING,
    },
    has_newsletter: {
      type: DataTypes.BOOLEAN,
    },
    groups: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    nb_commands: {
      type: DataTypes.INTEGER,
    },
    total_spent: {
      type: DataTypes.FLOAT,
    },

  }, { underscored: true });

  Customer.associate = models => {
    Customer.hasMany(models.Command);
    Customer.hasMany(models.Review);
    Customer.hasMany(models.Invoice);
  };

  return Customer;
};
