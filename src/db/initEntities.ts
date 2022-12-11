import { Sequelize } from 'sequelize/types';
import { init as initUsersEntity, UserEntity } from './entities/usersEntity';
import { init as initTokensEntity } from './entities/tokensEntity';
import { init as initRolesEntity, RolesEntity } from './entities/rolesEntity';
import { init as initUserRoleEntity, UserRoleEntity } from './entities/userRoleEntity';
import { init as initChangePasswordEntity } from './entities/changePasswordEntity';
import { init as initUserManagerEntity, UserManagerEntity } from './entities/userManagerEntity';
import { init as initMessagesEntity, MessagesEntity } from './entities/messagesEntity';
import { init as initRoomsEntity, RoomsEntity } from './entities/roomsEntity';
import { init as initUserRoomEntity, UserRoomEntity } from './entities/userRoomEntity';

export class InitEntities {
  static init(sequelize: Sequelize) {
    // models
    initUsersEntity(sequelize);
    initTokensEntity(sequelize);
    initRolesEntity(sequelize);
    initUserRoleEntity(sequelize);
    initChangePasswordEntity(sequelize);
    initUserManagerEntity(sequelize);
    initMessagesEntity(sequelize);
    initRoomsEntity(sequelize);
    initUserRoomEntity(sequelize);
    // relations
    UserEntity.belongsToMany(RolesEntity, {
      through: UserRoleEntity,
      as: 'roles',
      foreignKey: 'userId',
    });
    RolesEntity.belongsToMany(UserEntity, {
      through: UserRoleEntity,
      as: 'users',
      foreignKey: 'roleId',
    });
    UserEntity.belongsToMany(UserEntity, {
      through: UserManagerEntity,
      as: 'managers',
      foreignKey: 'userId',
    });
    UserEntity.belongsToMany(UserEntity, {
      through: UserManagerEntity,
      as: 'employees',
      foreignKey: 'managerId',
    });
    UserEntity.belongsToMany(RoomsEntity, {
      through: UserRoomEntity,
      as: 'userRooms',
      foreignKey: 'userId',
    });
    RoomsEntity.belongsToMany(UserEntity, {
      through: UserRoomEntity,
      as: 'roomUsers',
      foreignKey: 'roomId',
    });
    UserEntity.hasMany(MessagesEntity, {
      foreignKey: 'authorId',
      as: 'sentUserMessage',
    });
    MessagesEntity.belongsTo(UserEntity, {
      as: 'sentAuthorMessage',
      foreignKey: 'authorId',
    });
    RoomsEntity.hasMany(MessagesEntity, {
      foreignKey: 'roomId',
      as: 'roomMessages',
    });
    MessagesEntity.belongsTo(RoomsEntity, {
      as: 'messageRoom',
    });
  }
}
