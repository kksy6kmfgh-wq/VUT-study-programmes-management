import { rolePermissions, type Permission } from './permissions'
import type { RoleAssignment } from './roles'

export function can(assignment: RoleAssignment, permission: Permission) { return rolePermissions[assignment.role]?.includes(permission) ?? false }