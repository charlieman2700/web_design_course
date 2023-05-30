import { DataTypes } from 'sequelize'
import { sequelize } from '../database/sequelize'

const Address = sequelize.define('Address', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  homePhone: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  workPhone: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  homeAddress: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  workAddress: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
})

// `sequelize.define` also returns the model
// console.log(Address === sequelize.models.Address); // true
export default Address
