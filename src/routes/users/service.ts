import { UploadClient } from '@uploadcare/upload-client';
import { UserAttributes, UserCreationAttributes, UserEntity } from '../../db/entities/usersEntity';
import { createError } from '../../utils/errors';
import bcrypt from 'bcrypt';
import {
  ChangePasswordEntity,
  RolesEntity,
  RoomsEntity,
  UserManagerEntity,
  UserRoomEntity,
} from '../../db/entities';
import { tokenService } from '../../services/tokenService';
import { ArrayResponse, Pagination, TokenData } from '../../interfaces';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  RESET_PASSWORD_ROUTE,
  ROLES,
  STATUS,
} from '../../constants';
import { getTransaction } from '../../utils/getTransaction';
import rolesService from '../../services/rolesService';
import { ManagerEmployeeBody, ResetPasswordBody } from './controller';
import { sendEmail } from '../../services/mailService';
const { Op, Sequelize } = require('sequelize');

const EMPTY_STRING_LENGTH = 0;

class UsersService {
  private readonly _saltRounds = 12;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private client = new UploadClient({ publicKey: process.env.UPLOADCARE_PUBLIC_KEY! });
  private readonly HOUR = 360000;
  /* private readonly HALF_AN_HOUR = 180000;
  private readonly MINUTE = 6000; */
  async registration(data: UserCreationAttributes): Promise<{ message: string } | void> {
    try {
      const candidate = await UserEntity.findOne({ where: { email: data.email } });

      if (candidate) {
        throw new createError.UnprocessableEntity({
          data: { msg: `This email: ${data.email} is already being used.` },
        });
      }

      const hashPassword = await bcrypt.hash(data.password, this._saltRounds);

      const user = { ...data, password: hashPassword, isOnline: 'false' };

      const result = await UserEntity.create(user);

      if (result) {
        const allAdmins = await UserEntity.findAll({
          where: {
            status: STATUS.CONFIRMED,
          },
          include: [
            {
              model: RolesEntity,
              as: 'roles',
              where: { name: ROLES.ADMIN },
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        });

        for (const admin of allAdmins) {
          const adminInfo = admin.get({ plain: true });

          const room = await RoomsEntity.create();

          if (room) {
            await UserRoomEntity.create({ userId: adminInfo.id, roomId: room.id });
            await UserRoomEntity.create({ userId: result.id, roomId: room.id });
          }
        }

        return { message: 'Registration was successful' };
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async login(data: LoginData): Promise<UserData> {
    try {
      const { email, password: passwordData } = data;

      const user = await UserEntity.findOne({
        where: { email, status: STATUS.CONFIRMED },
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });

      if (!user) {
        throw new createError.NotFound({
          data: { msg: 'Account not found' },
        });
      }

      const isPasswordEqual = await bcrypt.compare(passwordData, user.password);

      if (!isPasswordEqual) {
        throw new createError.UnprocessableEntity({
          data: { msg: 'Wrong password!' },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, updatedAt, createdAt, deletedAt, ...userData }: UserAttributes = user.get({
        plain: true,
      });

      const tokenData = tokenService.generateTokens({
        ...userData,
      });

      await tokenService.saveToken(userData.id, tokenData.refreshToken);

      return {
        ...userData,
        tokenData,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getUsers(options: Partial<Pagination> = {}): Promise<ArrayResponse<UserEntity[]>> {
    try {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = options;

      const result = await UserEntity.findAndCountAll({
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
        attributes: [
          'id',
          'name',
          'surname',
          'email',
          'avatarImg',
          'status',
          'isOnline',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        results: result.rows,
        metadata: {
          count: result.count,
          limit,
          offset,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getUser(options: { id: string }): Promise<UserInfo> {
    const { id } = options;

    const user = await UserEntity.findOne({
      where: { id },
      include: [
        {
          model: RolesEntity,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new createError.NotFound();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, updatedAt, createdAt, deletedAt, ...userData }: UserAttributes = user.get({
      plain: true,
    });

    return {
      ...userData,
    };
  }

  async getConfirmedAndRejectedUsers(
    options: Partial<Pagination> = {},
  ): Promise<ArrayResponse<UserEntity[]>> {
    try {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = options;

      const result = await UserEntity.findAndCountAll({
        where: {
          [Op.or]: [{ status: STATUS.CONFIRMED }, { status: STATUS.REJECTED }],
        },
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
        attributes: [
          'id',
          'name',
          'surname',
          'email',
          'avatarImg',
          'status',
          'isOnline',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        results: result.rows,
        metadata: {
          count: result.count,
          limit,
          offset,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getPendingUsers(options: Partial<Pagination> = {}): Promise<ArrayResponse<UserEntity[]>> {
    try {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = options;

      const result = await UserEntity.findAndCountAll({
        where: {
          [Op.or]: [{ status: STATUS.PENDING }, { status: STATUS.REJECTED }],
        },
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
        attributes: [
          'id',
          'name',
          'surname',
          'email',
          'avatarImg',
          'status',
          'isOnline',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        results: result.rows,
        metadata: {
          count: result.count,
          limit,
          offset,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async rejectUserStatus(options: { id: string }): Promise<{ message: string } | void> {
    try {
      const { id } = options;

      const user = await UserEntity.findOne({ where: { id } });

      if (user) {
        const result = await UserEntity.update({ status: STATUS.REJECTED }, { where: { id } });

        if (result) {
          return { message: 'User status rejected successfully' };
        }
      } else {
        throw new createError.NotFound();
      }
    } catch (error) {
      throw new createError.NotFound();
    }
  }

  async confirmUserStatus(options: { id: string }): Promise<{ message: string } | void> {
    try {
      const { id } = options;

      const user = await UserEntity.findOne({ where: { id } });

      if (user) {
        const result = await UserEntity.update({ status: STATUS.CONFIRMED }, { where: { id } });

        if (result) {
          return { message: 'User status confirmed successfully' };
        }
      } else {
        throw new createError.NotFound();
      }
    } catch (error) {
      throw new createError.NotFound();
    }
  }

  async createNewUser(data: UserCreationAttributes): Promise<string> {
    try {
      const candidate = await UserEntity.findOne({ where: { email: data.email } });

      if (candidate) {
        throw new createError.UnprocessableEntity({
          data: { msg: `This email: ${data.email} is already being used.` },
        });
      }

      const hashPassword = await bcrypt.hash(data.password, this._saltRounds);

      const user = { ...data, password: hashPassword, isOnline: false };

      const result = await UserEntity.create(user);

      if (result) {
        const allAdmins = await UserEntity.findAll({
          where: {
            status: STATUS.CONFIRMED,
          },
          include: [
            {
              model: RolesEntity,
              as: 'roles',
              where: { name: ROLES.ADMIN },
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        });

        for (const admin of allAdmins) {
          const adminInfo = admin.get({ plain: true });

          const room = await RoomsEntity.create();

          if (room) {
            await UserRoomEntity.create({ userId: adminInfo.id, roomId: room.id });
            await UserRoomEntity.create({ userId: result.id, roomId: room.id });
          }
        }
      }

      return result.id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteUser(data: { id: string }): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    try {
      const user = (await UserEntity.findOne({
        where: { id: data.id },
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id'],
            through: { attributes: [] },
          },
        ],
        attributes: ['id'],
        raw: true,
        nest: true,
      })) as UserEntity & { roles: { id: string } };

      if (!user) {
        throw new createError.NotFound({
          data: { msg: 'User not found' },
        });
      }

      await rolesService.unassignRole({ userId: user.id, roleId: user.roles.id });

      const result = await UserEntity.destroy({
        where: { id: user.id },
        force: true,
        transaction: transaction,
      });

      if (result) {
        const removeRoomsResult = await UserRoomEntity.destroy({
          where: { userId: user.id },
          transaction: transaction,
        });

        if (removeRoomsResult) {
          transaction.commit();
          return { message: 'User has been deleted successfully' };
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async editUserInfo(data: EditUserData): Promise<UserData | void> {
    const transaction = await getTransaction();
    try {
      const user = await UserEntity.findByPk(data.id, {
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
        transaction: transaction,
      });

      if (!user) {
        throw new createError.NotFound();
      }

      if (user) {
        if (data.name && data.name !== user.name) {
          await user.update({ name: data.name }, { transaction: transaction });
        }

        if (data.surname && data.surname !== user.surname) {
          await user.update({ surname: data.surname }, { transaction: transaction });
        }

        if (data.email && data.email !== user.email) {
          await user.update({ email: data.email }, { transaction: transaction });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, lastTimezone, updatedAt, deletedAt, ...userData }: UserAttributes =
          user.get({
            plain: true,
          });

        const tokenData = tokenService.generateTokens({ ...userData });

        await tokenService.saveToken(userData.id, tokenData.refreshToken);

        transaction.commit();

        return { ...userData, tokenData };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async getFilteredUsers(options: {
    limit: number;
    offset: number;
    userRole: string;
    filter: string;
  }): Promise<ArrayResponse<UserEntity[]>> {
    const { limit, offset, userRole, filter } = options;

    const filterString = filter.toLowerCase();

    const filterResult = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${filterString}%` } },
        { surname: { [Op.iLike]: `%${filterString}%` } },
        { email: { [Op.iLike]: `%${filterString}%` } },
        Sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.col('UserEntity.name'),
            ' ',
            Sequelize.col('UserEntity.surname'),
          ),
          {
            [Op.iLike]: `%${filterString}%`,
          },
        ),
        Sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.col('UserEntity.surname'),
            ' ',
            Sequelize.col('UserEntity.name'),
          ),
          {
            [Op.iLike]: `%${filterString}%`,
          },
        ),
      ],
    };

    const result = await UserEntity.findAndCountAll({
      where: {
        status: 'Confirmed',
        ...(filter.length !== EMPTY_STRING_LENGTH ? filterResult : null),
      },
      distinct: true,
      include: [
        {
          model: RolesEntity,
          where: {
            ...(userRole === ROLES.MANAGER ? { name: ROLES.MANAGER } : null),
            ...(userRole === ROLES.EMPLOYEE ? { name: ROLES.EMPLOYEE } : null),
            ...(userRole === 'All'
              ? { [Op.or]: [{ name: ROLES.EMPLOYEE }, { name: ROLES.MANAGER }] }
              : null),
          },
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      attributes: ['id', 'name', 'surname', 'email'],
      limit,
      offset,
    });

    if (!result) {
      throw new createError.NotFound();
    }

    return {
      results: result.rows,
      metadata: {
        count: result.count,
        limit,
        offset,
      },
    };
  }

  async uploadUserAvatar(options: { id: string; file: Express.Multer.File }): Promise<UserData> {
    try {
      const { id, file } = options;

      const { uuid } = await this.client.uploadFile(file.buffer);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const downloadURL = `${process.env.UPLOADCARE_URL!}/${uuid}/`;

      await UserEntity.update(
        { avatarImg: downloadURL },
        {
          where: { id },
          returning: true,
        },
      );

      const user = await UserEntity.findOne({
        where: { id },
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });

      if (!user) {
        throw new createError.NotFound();
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, deletedAt, isOnline, ...userData }: UserAttributes =
        user.get({
          plain: true,
        });

      const tokenData = tokenService.generateTokens({ ...userData });

      await tokenService.saveToken(userData.id, tokenData.refreshToken);

      return { ...userData, tokenData };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async forgotPassword(data: { email: string }): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    try {
      const user = await UserEntity.findOne({ where: { email: data.email } });

      if (!user) {
        throw new createError.NotFound({ data: { msg: 'Account not found' } });
      }

      const reset = await ChangePasswordEntity.findOne({ where: { email: data.email } });

      if (reset) {
        const { createdAt } = reset.get({
          plain: true,
        });
        const momentDate = new Date();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const endDate = new Date(createdAt!.getTime() + this.HOUR);

        if (momentDate > endDate) {
          reset.destroy({ transaction: transaction });
        } else {
          throw new createError.UnprocessableEntity({
            data: { msg: `on this email: ${data.email} already send message.` },
          });
        }
      }

      const hashEmail = await bcrypt.hash(data.email, this._saltRounds);

      await ChangePasswordEntity.create({ userId: hashEmail, email: data.email }, { transaction });

      const userData: UserAttributes = user.get({
        plain: true,
      });

      let url = '';
      if (process.env.NODE_ENV !== 'production') {
        url += process.env.FRONTEND_URL + RESET_PASSWORD_ROUTE + `?userId=${hashEmail}/`;
      } else url += process.env.NETLIFY_URL + RESET_PASSWORD_ROUTE + `?userId=${hashEmail}/`;

      const result = await sendEmail(userData.email, 'Reset Password', userData.name, url);

      if (result) {
        transaction.commit();
        return { message: 'Resetting password was successful' };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async resetPassword(data: ResetPasswordBody): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    try {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const userId = data.hashedUserId.substring(0, data.hashedUserId.length - 1);

      const user = await ChangePasswordEntity.findOne({ where: { userId: userId } });

      if (!user) {
        throw new createError.NotFound();
      }

      const { email, ...rest } = user.get({
        plain: true,
      });

      const momentDate = new Date();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const endDate = new Date(rest.createdAt!.getTime() + this.HOUR);

      if (momentDate > endDate) {
        user.destroy();
        throw new createError.InternalServerError();
      }

      const hashPassword = await bcrypt.hash(data.password, this._saltRounds);

      const updatePasswordResult = await UserEntity.update(
        { password: hashPassword },
        { where: { email: email } },
      );

      if (updatePasswordResult) {
        const result = await ChangePasswordEntity.destroy({
          where: { id: user.id },
        });

        if (result) {
          transaction.commit();
          return { message: 'Password has been changed successfully' };
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async getManagerEmployees(options: { id: string }): Promise<UserEntity | void> {
    const { id } = options;

    const result = await UserEntity.findOne({
      where: {
        id: id,
      },
      attributes: [],
      include: [
        {
          model: UserEntity,
          as: 'employees',
          attributes: ['id', 'name', 'surname', 'isOnline', 'email'],
          through: { attributes: [] },
          order: [['createdAt', 'ASC']],
        },
      ],
      plain: true,
    });

    if (!result) {
      throw new createError.NotFound();
    }

    return result;
  }

  async addEmployeeToManagerTeam(data: ManagerEmployeeBody): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    const { employeeId, managerId } = data;

    try {
      const userManager = await UserManagerEntity.findOne({
        raw: true,
        where: { userId: employeeId, managerId: managerId },
        attributes: ['managerId'],
      });

      if (userManager) {
        throw new createError.UnprocessableEntity({
          data: { msg: 'The user already has this manager' },
        });
      }

      const result = await UserManagerEntity.create(
        {
          userId: employeeId,
          managerId: managerId,
        },
        { transaction },
      );

      if (result) {
        const room = await RoomsEntity.create({ transaction });

        if (room) {
          await UserRoomEntity.create({ roomId: room.id, userId: employeeId }, { transaction });

          await UserRoomEntity.create({ roomId: room.id, userId: managerId }, { transaction });

          transaction.commit();
          return { message: 'Manager added successfully' };
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async removeEmployeeFromManager(data: ManagerEmployeeBody): Promise<{ message: string } | void> {
    const transaction = await getTransaction();
    const { employeeId, managerId } = data;
    try {
      const userManager = await UserManagerEntity.findOne({
        raw: true,
        where: { userId: employeeId, managerId: managerId },
        attributes: ['managerId'],
      });

      if (!userManager) {
        throw new createError.UnprocessableEntity({
          data: { msg: 'The user does not have this manager' },
        });
      }

      const result = await UserManagerEntity.destroy({
        where: { userId: employeeId, managerId: managerId },
      });

      if (result) {
        await UserRoomEntity.destroy({ where: { userId: employeeId } });

        await UserRoomEntity.destroy({ where: { userId: managerId } });

        transaction.commit();
        return { message: 'Manager removed successfully' };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }
}

export interface UserData extends Omit<UserAttributes, 'password'> {
  tokenData: TokenData;
}

export interface UserInfo
  extends Omit<UserAttributes, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

interface LoginData {
  email: string;
  password: string;
}

interface EditUserData {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
}

export default new UsersService();
