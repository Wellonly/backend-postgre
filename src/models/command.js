
export default function command(sequelize, DataTypes) {
  // console.log('zv:', DataTypes);
  const Command = sequelize.define('command', {
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    date: {
      type: DataTypes.DATE,
    },
    customer_id: {
      type: DataTypes.INTEGER,
    },
    basket: {
      type: DataTypes.JSON,
    },
    total_ex_taxes: {
      type: DataTypes.FLOAT,
    },
    delivery_fees: {
      type: DataTypes.FLOAT,
    },
    tax_rate: {
      type: DataTypes.FLOAT,
    },
    taxes: {
      type: DataTypes.FLOAT,
    },
    total: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.STRING,
    },
    returned: {
      type: DataTypes.BOOLEAN,
    },
  }, { underscored: true });

  Command.associate = models => {
    Command.belongsTo(models.Customer);
    Command.hasMany(models.Invoice);
    Command.hasMany(models.Review);
  };

  return Command;
};
