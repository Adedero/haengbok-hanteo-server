import { getAll, countAndGetAll, getById, update, updateSettings } from '../../controllers/api/services/helpers'
import UserController from '../../controllers/user/user.controller'
import { Router } from 'express'

const router = Router()

router.get('/dashboard', UserController.getDashboard)

router.route('/transactions')
  .get(getAll('Transaction' as 'User'))
router.route('/transactions/:id')
  .get(getById('Transaction' as 'User'))

router.route('/properties')
  .get(countAndGetAll('Property' as 'User'))
router.route('/properties/:id')
  .get(getById('Property' as 'User'))


router.route('/notifications')
  .get(getAll('Notification' as 'User')) //get all notifications
  .put(UserController.updateNotifications)
router.delete('/notifications/clear', UserController.clearUserNotifications)


router.route('/settings')
  .put(updateSettings)

router.put('/account/change-password', UserController.changePassword)


router.put('/kyc/:id', update('User'))

router.put('/users/:id', update('User'))

export default router
