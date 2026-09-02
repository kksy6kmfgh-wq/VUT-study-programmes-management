import { can } from '../auth/access'
import type { RoleAssignment } from '../auth/roles'
export const canQualityCase = (assignment: RoleAssignment, permission: Parameters<typeof can>[1]) => can(assignment, permission)