'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Addresses', null, {})
    return queryInterface.bulkInsert('Addresses', [
      {
        name: 'John',
        lastName: 'Doe',
        homePhone: '82883746',
        workPhone: '22510765',
        homeAddress: '1234 Main St',
        workAddress: 'abcd Main St',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane',
        lastName: 'Doe',
        homePhone: '73838495',
        workPhone: '22510874',
        homeAddress: 'San Jose Main St',
        workAddress: 'Heredia Main St',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Alex',
        lastName: 'Doe',
        homePhone: '78898495',
        workPhone: '22987876',
        homeAddress: 'Puntarenas Main St',
        workAddress: 'Limon Main St',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Alexandra',
        lastName: 'Doe',
        homePhone: '87774653',
        workPhone: '22123456',
        homeAddress: 'Cartago Main St',
        workAddress: 'Guanacaste Main St',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Addreses', null, {})

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
