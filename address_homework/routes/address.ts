import express from 'express'
import AddressController from '../controllers/AddressController'

const router = express.Router()

const addressController = new AddressController()
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (_req, res) => {
  await addressController.index(_req, res)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/create', async (req, res) => {
  await addressController.create(req, res)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/edit/:id', async (req, res) => {
  await addressController.edit(req, res)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.all('/delete/:id', async (req, res) => {
  await addressController.delete(req, res)
})
export default router
