import express from 'express'
import * as AdminController from '../../controllers/admin/admin.controller'
import { authAdmin } from '../../middlewares/authAdmin.middleware'
import { validateRegisterUser, validateModifyPasswordUser } from '../../validators/user.validator'

const router = express.Router()

router.post('/login', AdminController.authAdminController)
router.use(authAdmin)
router.route('/profile')
  .get(authAdmin, AdminController.getAdminProfile)
  .put(authAdmin, validateRegisterUser(), AdminController.updateAdminProfile)
router.route('/password').put(authAdmin, validateModifyPasswordUser(), AdminController.updateAdminPassword)

export const adminRoutes = router