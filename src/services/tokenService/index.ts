import jwt from 'jsonwebtoken';
import { RolesEntity } from '../../db/entities';
import { TokenEntity } from '../../db/entities/tokensEntity';
import { UserAttributes, UserEntity } from '../../db/entities/usersEntity';
import { UserData } from '../../routes/users/service';
import { createError } from '../../utils/errors';

export const JWT_TIMESTAMPS = {
  accessExpiresIn: '60m',
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  refreshTokenExpiresInSec: 60 * 60 * 24 * 30,
};

class TokenService {
  private readonly _jwtAccessSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
  private readonly _jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_TOKEN;

  generateTokens(payload: Omit<UserAttributes, 'password'>): {
    refreshToken: string;
    accessToken: string;
  } {
    try {
      const accessToken = jwt.sign(payload, this._jwtAccessSecret as jwt.Secret, {
        expiresIn: JWT_TIMESTAMPS.accessExpiresIn,
      });

      const refreshToken = jwt.sign(payload, this._jwtRefreshSecret as jwt.Secret, {
        expiresIn: JWT_TIMESTAMPS.refreshTokenExpiresInSec,
      });
      return { accessToken, refreshToken };
    } catch (e) {
      throw e;
    }
  }
  async saveToken(userId: string, refreshToken: string): Promise<TokenEntity | string> {
    try {
      const tokenExists = await TokenEntity.findOne({ where: { userId } });
      if (tokenExists) {
        tokenExists.refreshToken = refreshToken;
        return tokenExists.save();
      }
      const token = await TokenEntity.create({ userId, refreshToken });
      return token;
    } catch (e) {
      throw e;
    }
  }
  async removeToken(refreshToken: string): Promise<number> {
    try {
      return await TokenEntity.destroy({ where: { refreshToken } });
    } catch (e) {
      throw e;
    }
  }
  async findToken(refreshToken: string): Promise<TokenEntity | null> {
    try {
      return await TokenEntity.findOne({ where: { refreshToken } });
    } catch (e) {
      throw e;
    }
  }
  validateAccessToken(accessToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TokenData>jwt.verify(accessToken, this._jwtAccessSecret as jwt.Secret);
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TokenData>jwt.verify(refreshToken, this._jwtRefreshSecret as jwt.Secret);
    } catch (e) {
      return null;
    }
  }
  async refresh(refreshToken: string): Promise<UserData> {
    try {
      if (!refreshToken) {
        throw new createError.Unauthenticated();
      }
      const userData = this.validateRefreshToken(refreshToken);
      const token = await this.findToken(refreshToken);

      if (!userData || !token) {
        throw new createError.Unauthenticated();
      }

      const result = await UserEntity.findByPk(userData.id, {
        include: [
          {
            model: RolesEntity,
            as: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });
      if (!result) {
        throw new createError.InternalServerError();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, updatedAt, createdAt, deletedAt, ...user }: UserAttributes = result.get({
        plain: true,
      });
      const tokenData = this.generateTokens({ ...user });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.saveToken(user!.id, tokenData.refreshToken);
      return {
        ...user,
        tokenData,
      } as UserData;
    } catch (e) {
      throw e;
    }
  }

  getUserId(token: string) {
    try {
      const data = jwt.decode(token);
      const { id } = data as { id: string };

      return id;
    } catch (e) {
      throw e;
    }
  }
}
export const tokenService = new TokenService();

type TokenData = Omit<UserAttributes, 'password'>;
