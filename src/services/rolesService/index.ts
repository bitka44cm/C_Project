import { RolesEntity, UserEntity, UserRoleEntity } from '../../db/entities';
import { UserRoleCreationAttributes } from '../../db/entities/userRoleEntity';
import { createError } from '../../utils/errors';
import { getTransaction } from '../../utils/getTransaction';

class RolesService {
  async searchRoleIdByRoleName(roleName: string): Promise<string> {
    const userRole = await RolesEntity.findOne({
      where: { name: roleName },
      attributes: ['id'],
    });
    if (!userRole) {
      throw new createError.NotFound();
    }
    return String(userRole?.id);
  }

  async searchUserRole(userId: string, userRoleId: string): Promise<void> {
    const userRoles = await UserRoleEntity.findAll({
      raw: true,
      where: { userId },
      attributes: ['roleId'],
    });
    const userRolesId = userRoles.map((role) => role.roleId);
    if (userRolesId.includes(userRoleId)) {
      throw new createError.UnprocessableEntity({
        data: { msg: 'The user already has this role' },
      });
    }
  }

  async assignRole(data: UserRoleCreationAttributes): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    try {
      const user = await UserEntity.findOne({ where: { id: data.userId } });

      if (user) {
        const result = await UserRoleEntity.create(
          { roleId: data.roleId, userId: data.userId },
          { transaction },
        );

        if (result) {
          await UserEntity.update(
            { status: 'Confirmed' },
            { where: { id: data.userId }, transaction: transaction },
          );
          transaction.commit();

          return { message: 'Role assigned successfully' };
        }
      } else {
        throw new createError.NotFound();
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async unassignRole(data: UserRoleCreationAttributes): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    try {
      const result = await UserRoleEntity.destroy({
        where: { userId: data.userId, roleId: data.roleId },
        transaction: transaction,
      });

      if (result) {
        transaction.commit();

        return { message: 'Role unassigned successfully' };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }
}

export default new RolesService();
