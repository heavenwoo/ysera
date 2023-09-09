import { Role, User } from '@prisma/client';
import { tryGet } from '@ysera/agx-util';

export class UserDataAccessScope {
  static secureUser(user: User): Partial<User> {
    const { password, ...securedUser } = user;
    return securedUser;
  }

  static getSecuredUser(user: User, currentUser?: User): Partial<User> {
    return tryGet(
      () => UserDataAccessScope[currentUser?.role.toLowerCase() as string](user, currentUser),
      UserDataAccessScope.anonymous(user)
    );
  }

  static anonymous(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    const {
      isActive,
      isVerified,
      email,
      sessionVersion,
      role,
      language,
      permissions,
      groupId,
      ...prunedUser
    } = securedUser;
    return prunedUser;
  }

  static user(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    if (user.id !== currentUser?.id) {
      return UserDataAccessScope.anonymous(user);
    }

    const { sessionVersion, isActive, ...prunedUser } = securedUser;
    return prunedUser;
  }

  static staff(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    if ([Role.SUPERUSER, Role.ADMIN].some((role) => role === user.role)) {
      const { isActive, sessionVersion, role, permissions, groupId, ...prunedUser } = securedUser;
      return prunedUser;
    }
    return securedUser;
  }

  static admin(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    if (user.role === Role.SUPERUSER) {
      const { isActive, sessionVersion, role, permissions, groupId, ...prunedUser } = securedUser;
      return prunedUser;
    }
    return securedUser;
  }

  static superuser(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    return securedUser;
  }
}
