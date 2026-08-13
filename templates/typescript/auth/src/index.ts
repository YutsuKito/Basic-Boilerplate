export type Role = "user" | "admin" | "service";
export type Permission = "profile:read" | "profile:write" | "admin:read" | "admin:write";

export interface Identity {
  subject: string;
  email?: string;
  roles: Role[];
}

export interface AuthProvider {
  authenticate(input: unknown): Promise<Identity | null>;
}

const grants: Record<Role, ReadonlySet<Permission>> = {
  user: new Set(["profile:read", "profile:write"]),
  admin: new Set(["profile:read", "profile:write", "admin:read", "admin:write"]),
  service: new Set(["admin:read"]),
};

export const can = (identity: Identity, permission: Permission): boolean =>
  identity.roles.some((role) => grants[role].has(permission));

export function requirePermission(identity: Identity, permission: Permission): void {
  if (!can(identity, permission)) throw new Error("forbidden");
}
