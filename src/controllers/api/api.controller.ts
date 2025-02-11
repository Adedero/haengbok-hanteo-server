import getAdminDashboard from "./services/admin-dashboard"
import contactCustomerCare from "./services/contact"
import createProperty from "./services/create-property"
import deleteProperty from "./services/delete-property"
import resetUserPassword from "./services/reset-password"

const ApiController = {
  createProperty,
  contactCustomerCare,
  getAdminDashboard,
  resetUserPassword,
  deleteProperty
}

export default ApiController