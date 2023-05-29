import express from 'express'
import { prisma } from '../index'

const router = express.Router()

router.get('/', async (_req, res) => {
  const allAddresses = await prisma.address.findMany()
  res.render('address/addressIndex', { address: allAddresses })
})

export default router
