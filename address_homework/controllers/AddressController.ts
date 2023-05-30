import { Request, Response } from 'express'
import Address from '../models/Address'

class AddressController {
  async index (_req: Request, res: Response): Promise<void> {
    const allAddresses = await Address.findAll({ raw: true })
    res.render('address/index', { address: allAddresses })
  }

  async create (req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      await Address.create(
        {
          name: req.body.name,
          lastName: req.body.lastName,
          homePhone: req.body.homePhone,
          homeAddress: req.body.homeAddress,
          workPhone: req.body.workPhone,
          workAddress: req.body.workAddress
        }
      )
      res.redirect('/address')
    } else {
      res.render('address/create', { title: 'Weblog, crear' })
    }
  }

  async edit (req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      console.log(req.body)

      await Address.update(
        {
          name: req.body.name,
          homePhone: req.body.homePhone,
          homeAddress: req.body.homeAddress,
          workPhone: req.body.workPhone,
          workAddress: req.body.workAddress
        },
        { where: { id: req.params.id } }
      )
      res.redirect('/address')
    } else {
      const address = await Address.findByPk(req.params.id, { raw: true })
      res.render('address/edit', { address })
    }
  }

  async delete (req: Request, res: Response): Promise<void> {
    await Address.destroy({ where: { id: req.params.id } })
    res.redirect('/address')
  }
}

export default AddressController
