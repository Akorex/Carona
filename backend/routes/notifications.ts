import {Router} from 'express'
import {isLoggedIn} from '../middlewares/authentication'
import {
    getAllNotifications,
    getNotification
} from '../controllers/notifications'


const notificationRouter = Router()


notificationRouter.get('/', isLoggedIn, getAllNotifications)
notificationRouter.get('/:id', isLoggedIn, getNotification)

export default notificationRouter