import express from 'express'
import * as UserManagementController from '../../controllers/admin/userManagement.controller'

const router = express.Router()

router.get('/all-users', UserManagementController.getAllUsers)
router.route('/user/details')
  .get(UserManagementController.getUserProfileById)
  .put()
router.get('/user/transaction-logs', UserManagementController.getTransactionLogsByUserId)
router.get('/user-search', UserManagementController.searchUser)

export const userManagementRoutes = router