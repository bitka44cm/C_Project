import { Request, Response } from 'express';
import moment from 'moment';
import { COOKIE_OPTIONS, DEFAULT_LIMIT, DEFAULT_OFFSET, HTTP_CODE } from '../../constants';
import { ResponseLocals } from '../../interfaces';
import { tokenService } from '../../services/tokenService';
import rolesService from '../../services/rolesService';
import usersService from './service';

class UsersController {
  async getUsers(
    req: Request,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;

      const result = await usersService.getUsers({ limit: Number(limit), offset: Number(offset) });

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async registration(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, CreateUserBody>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ) {
    const { name, surname, email, password } = req.body;

    const result = await usersService.registration({ name, surname, email, password });

    res.status(HTTP_CODE.CREATED).json(result);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(req: Request<any, any, LoginUserBody>, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await usersService.login({ email, password });

      res.cookie('refreshToken', result.tokenData.refreshToken, COOKIE_OPTIONS);

      delete result.tokenData.refreshToken;

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        await tokenService.removeToken(refreshToken);
        res.clearCookie('refreshToken');
      }
      res.send();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getConfirmedAndRejectedUsers(
    req: Request,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;

      const result = await usersService.getConfirmedAndRejectedUsers({
        limit: Number(limit),
        offset: Number(offset),
      });

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getPendingUsers(
    req: Request,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;

      const result = await usersService.getPendingUsers({
        limit: Number(limit),
        offset: Number(offset),
      });

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async rejectUserStatus(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<{ id: string }>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await usersService.rejectUserStatus({ id });

      res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async confirmUserStatus(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<{ id: string }>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await usersService.confirmUserStatus({ id });

      res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async refresh(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ) {
    try {
      const { refreshToken } = req.cookies;

      const result = await tokenService.refresh(refreshToken);

      res.cookie('refreshToken', result.tokenData.refreshToken, COOKIE_OPTIONS);

      delete result.tokenData.refreshToken;

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createNewUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<unknown, unknown, CreateNewUser>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ) {
    try {
      const { name, surname, email, password, roleName } = req.body;

      const userId = await usersService.createNewUser({ name, surname, email, password });

      const roleId = await rolesService.searchRoleIdByRoleName(roleName);

      await rolesService.assignRole({ userId, roleId });

      res.status(HTTP_CODE.CREATED).json({ message: 'New User has been created!' });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteUser(
    req: Request<{ id: string }>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ) {
    try {
      const { id } = req.params;

      const result = await usersService.deleteUser({ id });

      res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<{ id: string }>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await usersService.getUser({ id });
      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async editUser(req: Request<any, any, EditUserData>, res: Response) {
    try {
      const { id, name, surname, email } = req.body;

      const result = await usersService.editUserInfo({
        id,
        name,
        surname,
        email,
      });

      if (result) {
        res.cookie('refreshToken', result.tokenData.refreshToken, COOKIE_OPTIONS);

        delete result.tokenData.refreshToken;
        res.status(HTTP_CODE.CREATED).json(result);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getFilteredUsers(
    req: Request,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const {
        limit = DEFAULT_LIMIT,
        offset = DEFAULT_OFFSET,
        userRole = 'ALL',
        filter = '',
      } = req.query;

      const result = await usersService.getFilteredUsers({
        limit: Number(limit),
        offset: Number(offset),
        userRole: String(userRole),
        filter: String(filter),
      });

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async uploadUserAvatar(
    req: Request,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { id } = req.body;

      const file = req.file;

      if (file) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        file.originalname = `${date}-${file.originalname}`;

        const result = await usersService.uploadUserAvatar({ id, file });

        res.cookie('refreshToken', result.tokenData.refreshToken, COOKIE_OPTIONS);

        delete result.tokenData.refreshToken;

        res.json(result);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async forgotPassword(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, ForgotPasswordUserBody>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ) {
    try {
      const { email } = req.body;

      const result = await usersService.forgotPassword({ email });

      res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async resetPassword(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, ResetPasswordBody>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ) {
    try {
      const { password, hashedUserId } = req.body;

      const result = await usersService.resetPassword({
        hashedUserId: hashedUserId,
        password: password,
      });

      return res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getManagerEmployees(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<{ id: string }>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await usersService.getManagerEmployees({
        id,
      });

      res.json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async addEmployeeToManagerTeam(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, ManagerEmployeeBody>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { managerId, employeeId } = req.body;

      const result = await usersService.addEmployeeToManagerTeam({ employeeId, managerId });

      res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async removeEmployeeFromManagerTeam(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, ManagerEmployeeBody>,
    res: Response<unknown, ResponseLocals.AuthenticatedUser>,
  ): Promise<void> {
    try {
      const { managerId, employeeId } = req.body;

      const result = await usersService.removeEmployeeFromManager({
        employeeId,
        managerId,
      });

      res.status(HTTP_CODE.CREATED).json(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export interface ManagerEmployeeBody {
  employeeId: string;
  managerId: string;
}

interface CreateUserBody {
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface CreateNewUser extends CreateUserBody {
  roleName: string;
}

interface LoginUserBody {
  email: string;
  password: string;
}

interface EditUserData {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
}

export interface ResetPasswordBody {
  hashedUserId: string;
  password: string;
}

interface ForgotPasswordUserBody extends Pick<CreateUserBody, 'email'> {}

export default new UsersController();
