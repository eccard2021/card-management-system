import express from 'express'
import * as UserManagementController from '../../controllers/admin/userManagement.controller'

const router = express.Router()

router.get('/all-users', UserManagementController.getAllUsers)
router.route('/user/details')
  .get(UserManagementController.getUserProfileById)
  .put(UserManagementController.updateUserProfile)
router.get('/user/transaction-log', UserManagementController.getTransactionLogDetails)
router.get('/user-search', UserManagementController.searchUser)

export const userManagementRoutes = router