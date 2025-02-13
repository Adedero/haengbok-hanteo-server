import ApiController from '../../controllers/api/api.controller'
import { Router } from 'express'
import { count, deleteOne, getAll, getById, update, updateSettings } from './../../controllers/api/services/helpers';
import { createTransaction } from '../../controllers/api/services/transaction.service';
import { deleteUser } from '../../controllers/api/services/user.service';

const router = Router()

router.post('/contact', ApiController.contactCustomerCare)


//Admin routes
router.route('/transactions')
  .get(getAll('Transaction' as 'User'))
  .post(createTransaction)

router.route('/transactions/:id')
  .get(getById('Transaction' as 'User'))
  .put(update('Transaction' as 'User'))
  .delete(deleteOne('Transaction' as 'User'))

router.get('/transactions-count', count('Transaction' as 'User'))



router.route('/properties')
  .get(getAll('Property' as 'User'))
  .post(ApiController.createProperty)

router.route('/properties/:id')
  .get(getById('Property' as 'User'))
  .put(update('Property' as 'User'))
  .delete(ApiController.deleteProperty)
  //.delete(deleteOne('Property' as 'User'))

router.get('/properties-count', count('Property' as 'User'))


router.get('/users', getAll('User'))
router.get('/users-count', count('User'))

router.route('/users/:id')
  .get(getById('User'))
  .put(update('User'))
  .delete(deleteUser)

router.put('/user-password-reset/:id', ApiController.resetUserPassword)



router.put('/settings', updateSettings)

router.get('/admin-dashboard', ApiController.getAdminDashboard)

export default router
