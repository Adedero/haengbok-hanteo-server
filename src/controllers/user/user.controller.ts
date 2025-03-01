import getDashboard from "./services/get-dashboard"
import changePassword from "./services/change-password"
import { clearUserNotifications, updateNotifications } from "./services/notifications"


const UserController = {
  getDashboard,
  changePassword,
  clearUserNotifications,
  updateNotifications,
}

export default UserController