import express from 'express'
import * as AdminController from '../../controllers/admin/admin.controller'

const router = express.Router()

router.post('/login', AdminController.authAdminController)
router.route('/profile').get().put()

export const adminRoutes = router