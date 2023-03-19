
export default function invoice(sequelize, DataTypes) {
  // console.log('zv:', DataTypes);
  const Invoice = sequelize.define('invoice', {
    date: {
      type: DataTypes.DATE,
    },
    command_id: {
      type: DataTypes.INTEGER,
    },
    customer_id: {
      type: DataTypes.INTEGER,
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
  }, { underscored: true });

  Invoice.associate = models => {
    Invoice.belongsTo(models.Command);
    Invoice.belongsTo(models.Customer);
  };

  return Invoice;
};
