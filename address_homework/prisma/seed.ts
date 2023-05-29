import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main (): Promise<void> {
  await prisma.address.createMany(
    {
      data: [
        {
          name: 'John Doe',
          homePhone: '82883746',
          workPhone: '22510765',
          homeAddress: '1234 Main St',
          workAddress: 'abcd Main St'
        },
        {
          name: 'Jane Doe',
          homePhone: '73838495',
          workPhone: '22510874',
          homeAddress: 'San Jose Main St',
          workAddress: 'Heredia Main St'
        },
        {
          name: 'Alex Doe',
          homePhone: '78898495',
          workPhone: '22987876',
          homeAddress: 'Puntarenas Main St',
          workAddress: 'Limon Main St'
        },

        {
          name: 'Alexandra Doe',
          homePhone: '87774653',
          workPhone: '22123456',
          homeAddress: 'Cartago Main St',
          workAddress: 'Guanacaste Main St'
        }
      ],
      skipDuplicates: true
    }
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
