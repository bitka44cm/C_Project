import Joi from 'joi';
import { faker } from '@faker-js/faker';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, ROLES, STATUS, RESPONSE_CODE } from '../../constants';
import { buildResponse, schemaErrorExample } from '../../utils/schemaResponseExamples';
import { EndpointSchema } from '../../interfaces';

const MAX_USER_NAME_LENGTH = 11;
const MAX_USER_SURNAME_LENGTH = 14;
const MIN_USER_PASSWORD_LENGTH = 8;

const getUsersSchema: EndpointSchema = {
  query: Joi.object({
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }).example({
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
  }),
  response: {
    200: {
      schema: Joi.object({
        results: Joi.array().items({
          id: Joi.string().uuid(),
          name: Joi.string(),
          surname: Joi.string(),
          email: Joi.string(),
          avatarImg: Joi.string(),
          status: Joi.string(),
          isOnline: Joi.boolean(),
          createdAt: Joi.string(),
          updatedAt: Joi.string(),
          deletedAt: Joi.string(),
          roles: Joi.array().items(
            Joi.object().keys({
              id: Joi.string(),
              name: Joi.string(),
            }),
          ),
        }),
        metadata: {
          count: Joi.number().integer(),
          limit: Joi.number().integer(),
          offset: Joi.number().integer(),
        },
      }).example({
        results: [
          {
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            email: faker.internet.email(),
            avatarImg: faker.image.image(),
            status: STATUS.PENDING,
            isOnline: faker.datatype.boolean(),
            createdAt: faker.date.soon(),
            updatedAt: faker.date.soon(),
            deletedAt: faker.date.soon(),
            roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
          },
        ],
        metadata: {
          count: 1,
          limit: DEFAULT_LIMIT,
          offset: DEFAULT_OFFSET,
        },
      }),

      swaggerOptions: {
        description: 'Get users',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const registrationSchema: EndpointSchema = {
  body: Joi.object({
    name: Joi.string().max(MAX_USER_NAME_LENGTH).required(),
    surname: Joi.string().max(MAX_USER_SURNAME_LENGTH).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_USER_PASSWORD_LENGTH).required(),
  }).example({
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),
  response: {
    201: {
      schema: Joi.object({ message: Joi.string() }).example({
        message: 'Registration was successful',
      }),
      swaggerOptions: {
        description: 'Registration',
      },
    },
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const loginSchema: EndpointSchema = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).example({
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),

  response: {
    200: {
      schema: Joi.object({
        id: Joi.string().uuid(),
        name: Joi.string(),
        surname: Joi.string(),
        email: Joi.string().email(),
        avatarImg: Joi.string(),
        status: Joi.string(),
        isOnline: Joi.boolean(),
        tokenData: Joi.object({
          accessToken: Joi.string(),
          refreshToken: Joi.string(),
        }),
        roles: Joi.array().items(
          Joi.object().keys({
            id: Joi.string(),
            name: Joi.string(),
          }),
        ),
      }).example({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.email(),
        avatarImg: faker.internet.url(),
        status: STATUS.CONFIRMED,
        isOnline: faker.datatype.boolean(),
        tokenData: {
          accessToken: faker.datatype.uuid(),
        },
        roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
      }),
      swaggerOptions: {
        description: 'Login',
      },
    },
    404: buildResponse(schemaErrorExample.notFound()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const logoutSchema: EndpointSchema = {
  response: {
    200: {
      schema: Joi.object({}).allow(null),
      swaggerOptions: {
        description: 'Logout user',
      },
    },

    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const getConfirmedAndRejectedUsersSchema: EndpointSchema = {
  query: Joi.object({
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }).example({
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
  }),
  response: {
    200: {
      schema: Joi.object({
        results: Joi.array().items({
          id: Joi.string().uuid(),
          name: Joi.string(),
          surname: Joi.string(),
          email: Joi.string(),
          avatarImg: Joi.string(),
          status: Joi.string(),
          isOnline: Joi.boolean(),
          createdAt: Joi.string(),
          updatedAt: Joi.string(),
          deletedAt: Joi.string(),
          roles: Joi.array().items(
            Joi.object().keys({
              id: Joi.string(),
              name: Joi.string(),
            }),
          ),
        }),
        metadata: {
          count: Joi.number().integer(),
          limit: Joi.number().integer(),
          offset: Joi.number().integer(),
        },
      }).example({
        results: [
          {
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            email: faker.internet.email(),
            avatarImg: faker.image.image(),
            status: STATUS.CONFIRMED,
            isOnline: faker.datatype.boolean(),
            createdAt: faker.date.soon(),
            updatedAt: faker.date.soon(),
            deletedAt: faker.date.soon(),
            roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
          },
        ],
        metadata: {
          count: 1,
          limit: DEFAULT_LIMIT,
          offset: DEFAULT_OFFSET,
        },
      }),

      swaggerOptions: {
        description: 'Get confirmed and rejected users',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    403: buildResponse(schemaErrorExample.forbiddenError(RESPONSE_CODE.FORBIDDEN_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const getPendingUsersSchema: EndpointSchema = {
  query: Joi.object({
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }).example({
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
  }),
  response: {
    200: {
      schema: Joi.object({
        results: Joi.array().items({
          id: Joi.string().uuid(),
          name: Joi.string(),
          surname: Joi.string(),
          email: Joi.string(),
          avatarImg: Joi.string(),
          status: Joi.string(),
          isOnline: Joi.boolean(),
          createdAt: Joi.string(),
          updatedAt: Joi.string(),
          deletedAt: Joi.string(),
          roles: Joi.array().items(
            Joi.object().keys({
              id: Joi.string(),
              name: Joi.string(),
            }),
          ),
        }),
        metadata: {
          count: Joi.number().integer(),
          limit: Joi.number().integer(),
          offset: Joi.number().integer(),
        },
      }).example({
        results: [
          {
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            email: faker.internet.email(),
            avatarImg: faker.image.image(),
            status: STATUS.PENDING,
            isOnline: faker.datatype.boolean(),
            createdAt: faker.date.soon(),
            updatedAt: faker.date.soon(),
            deletedAt: faker.date.soon(),
            roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
          },
        ],
        metadata: {
          count: 1,
          limit: DEFAULT_LIMIT,
          offset: DEFAULT_OFFSET,
        },
      }),

      swaggerOptions: {
        description: 'Get pending users',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    403: buildResponse(schemaErrorExample.forbiddenError(RESPONSE_CODE.FORBIDDEN_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const rejectUserStatusSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).example({
    id: faker.datatype.uuid(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      }).example({
        message: 'User status rejected successfully',
      }),
      swaggerOptions: {
        description: 'Reject user status',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    403: buildResponse(schemaErrorExample.forbiddenError(RESPONSE_CODE.FORBIDDEN_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const confirmUserStatusSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).example({
    id: faker.datatype.uuid(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      }).example({
        message: 'User status confirmed successfully',
      }),
      swaggerOptions: {
        description: 'Confirm user status',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    403: buildResponse(schemaErrorExample.forbiddenError(RESPONSE_CODE.FORBIDDEN_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const refreshSchema: EndpointSchema = {
  response: {
    200: {
      schema: Joi.object({
        id: Joi.string().uuid(),
        name: Joi.string(),
        surname: Joi.string(),
        email: Joi.string().email(),
        avatarImg: Joi.string(),
        status: Joi.string(),
        isOnline: Joi.boolean(),
        tokenData: Joi.object({
          accessToken: Joi.string(),
          refreshToken: Joi.string(),
        }),
      })
        .example({
          id: faker.datatype.uuid(),
          name: faker.name.firstName(),
          surname: faker.name.lastName(),
          email: faker.internet.email(),
          avatarImg: faker.internet.url(),
          status: STATUS.CONFIRMED,
          isOnline: faker.datatype.boolean(),
          tokenData: {
            accessToken: faker.datatype.uuid(),
          },
        })
        .allow(null),
      swaggerOptions: {
        description: 'Refresh access token',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const createNewUserSchema: EndpointSchema = {
  body: Joi.object({
    name: Joi.string().max(MAX_USER_NAME_LENGTH).required(),
    surname: Joi.string().max(MAX_USER_SURNAME_LENGTH).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_USER_PASSWORD_LENGTH).required(),
    roleName: Joi.string().required(),
  }).example({
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleName: ROLES.EMPLOYEE,
  }),

  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      }).example({
        message: 'New User has been created!',
      }),
      swaggerOptions: {
        description: 'Create new user',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    403: buildResponse(schemaErrorExample.forbiddenError(RESPONSE_CODE.FORBIDDEN_ERROR)),
    404: buildResponse(schemaErrorExample.notFound()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const deleteUserSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).example({
    id: faker.datatype.uuid(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      })
        .example({
          message: 'User has been deleted successfully',
        })
        .allow(null),
      swaggerOptions: {
        description: 'Delete user',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    403: buildResponse(schemaErrorExample.forbiddenError(RESPONSE_CODE.FORBIDDEN_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const getUserSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  response: {
    200: {
      schema: Joi.object({
        id: Joi.string().uuid(),
        name: Joi.string(),
        surname: Joi.string(),
        email: Joi.string().email(),
        avatarImg: Joi.string(),
        status: Joi.string(),
        isOnline: Joi.boolean(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
        deletedAt: Joi.string(),
        tokenData: Joi.object({
          accessToken: Joi.string(),
          refreshToken: Joi.string(),
        }),
        roles: Joi.array().items(
          Joi.object().keys({
            id: Joi.string(),
            name: Joi.string(),
          }),
        ),
      })
        .example({
          id: faker.datatype.uuid(),
          name: faker.name.firstName(),
          surname: faker.name.lastName(),
          email: faker.internet.email(),
          avatarImg: faker.internet.url(),
          status: STATUS.CONFIRMED,
          isOnline: faker.datatype.boolean(),
          createdAt: faker.date.soon(),
          updatedAt: faker.date.soon(),
          deletedAt: faker.date.soon(),
          tokenData: {
            accessToken: faker.datatype.uuid(),
          },
          roles: [{ id: faker.datatype.uuid(), name: 'Employee' }],
        })
        .allow(null),
      swaggerOptions: {
        description: 'Get user',
      },
    },

    404: buildResponse(schemaErrorExample.notFound()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const editUserSchema: EndpointSchema = {
  body: Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().allow(''),
    surname: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
  }).example({
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
  }),

  response: {
    201: {
      schema: Joi.object({
        id: Joi.string().uuid(),
        name: Joi.string(),
        surname: Joi.string(),
        email: Joi.string(),
        avatarImg: Joi.string(),
        status: Joi.string(),
        isOnline: Joi.boolean(),
        createdAt: Joi.string(),
        tokenData: Joi.object({
          accessToken: Joi.string(),
        }),
        roles: Joi.array().items(
          Joi.object().keys({
            id: Joi.string(),
            name: Joi.string(),
          }),
        ),
      })
        .example({
          id: faker.datatype.uuid(),
          name: faker.name.firstName(),
          surname: faker.name.lastName(),
          email: faker.internet.email(),
          avatarImg: faker.internet.url(),
          status: STATUS.CONFIRMED,
          isOnline: faker.datatype.boolean(),
          createdAt: faker.date.soon(),
          roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
          tokenData: {
            accessToken: faker.datatype.uuid(),
          },
        })
        .allow(null),
      swaggerOptions: {
        description: 'Patch user properties',
      },
    },

    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    404: buildResponse(schemaErrorExample.notFound()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const getFilteredUsersSchema: EndpointSchema = {
  query: Joi.object({
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
    userRole: Joi.string().allow(''),
    filter: Joi.string().allow(''),
  }).example({
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
    userRole: ROLES.EMPLOYEE,
    filter: faker.word.verb(),
  }),
  response: {
    200: {
      schema: Joi.object({
        results: Joi.array().items({
          id: Joi.string().uuid(),
          name: Joi.string(),
          surname: Joi.string(),
          email: Joi.string(),
          roles: Joi.array().items(
            Joi.object().keys({
              id: Joi.string(),
              name: Joi.string(),
            }),
          ),
        }),
        metadata: {
          count: Joi.number().integer(),
          limit: Joi.number().integer(),
          offset: Joi.number().integer(),
        },
      }).example({
        results: [
          {
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            email: faker.internet.email(),
            roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
          },
        ],
        metadata: {
          count: 1,
          limit: DEFAULT_LIMIT,
          offset: DEFAULT_OFFSET,
        },
      }),

      swaggerOptions: {
        description: 'Get filtered users',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const uploadUserAvatarSchema: EndpointSchema = {
  body: Joi.object({
    id: Joi.string().uuid().required(),
    file: Joi.string().allow(''),
  }).example({
    id: faker.datatype.uuid(),
    file: '<Buffer ...>',
  }),
  response: {
    200: {
      schema: Joi.object({
        id: Joi.string().uuid(),
        name: Joi.string(),
        surname: Joi.string(),
        email: Joi.string(),
        tokenData: Joi.object({
          accessToken: Joi.string(),
        }),
        roles: Joi.array().items(
          Joi.object().keys({
            id: Joi.string(),
            name: Joi.string(),
          }),
        ),
      }).example({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        tokenData: {
          accessToken: faker.datatype.uuid(),
        },
        roles: [{ id: faker.datatype.uuid(), name: ROLES.EMPLOYEE }],
      }),

      swaggerOptions: {
        description: 'Upload user avatar',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const resetPasswordSchema: EndpointSchema = {
  body: Joi.object({
    hashedUserId: Joi.string().required(),
    password: Joi.string().min(MIN_USER_PASSWORD_LENGTH).required(),
  }).example({
    hashedUserId: faker.datatype.uuid(),
    password: faker.internet.password(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      }).example({
        message: 'Password has been changed successfully',
      }),
    },
    404: buildResponse(schemaErrorExample.notFound()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const forgotPasswordSchema: EndpointSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }).example({
    email: faker.internet.email(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      }).example({
        message: 'Resetting password was successful',
      }),
    },
    404: buildResponse(schemaErrorExample.notFound()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const getManagerEmployeesSchema: EndpointSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).example({
    id: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        employees: Joi.array().items(
          Joi.object().keys({
            id: Joi.string().uuid(),
            name: Joi.string(),
            surname: Joi.string(),
            isOnline: Joi.boolean(),
            email: Joi.string(),
          }),
        ),
      }).example({
        employees: [
          {
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            isOnline: faker.datatype.boolean(),
            email: faker.internet.email(),
          },
        ],
      }),
      swaggerOptions: {
        description: 'Get manager employees',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    404: buildResponse(schemaErrorExample.notFound()),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const addEmployeeToManagerTeamSchema: EndpointSchema = {
  body: Joi.object({
    employeeId: Joi.string().uuid().required(),
    managerId: Joi.string().uuid().required(),
  }).example({
    employeeId: faker.datatype.uuid(),
    managerId: faker.datatype.uuid(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      })
        .example({
          message: 'Manager added successfully',
        })
        .allow(null),
      swaggerOptions: {
        description: 'Add employee to manager team',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

const removeEmployeeFromManagerTeamSchema: EndpointSchema = {
  body: Joi.object({
    employeeId: Joi.string().uuid().required(),
    managerId: Joi.string().uuid().required(),
  }).example({
    managerId: faker.datatype.uuid(),
    employeeId: faker.datatype.uuid(),
  }),
  response: {
    201: {
      schema: Joi.object({
        message: Joi.string(),
      })
        .example({
          message: 'Manager removed successfully',
        })
        .allow(null),
      swaggerOptions: {
        description: 'Remove user manager',
      },
    },
    401: buildResponse(schemaErrorExample.unauthenticatedError()),
    422: buildResponse(schemaErrorExample.unprocessableEntity(RESPONSE_CODE.VALIDATION_ERROR)),
    500: buildResponse(schemaErrorExample.internalServerError()),
  },
};

export default {
  getUsers: getUsersSchema,
  registration: registrationSchema,
  login: loginSchema,
  logout: logoutSchema,
  getConfirmedAndRejectedUsers: getConfirmedAndRejectedUsersSchema,
  getPendingUsers: getPendingUsersSchema,
  rejectUserStatus: rejectUserStatusSchema,
  confirmUserStatus: confirmUserStatusSchema,
  refresh: refreshSchema,
  createNewUser: createNewUserSchema,
  deleteUser: deleteUserSchema,
  getUser: getUserSchema,
  editUser: editUserSchema,
  getFilteredUsers: getFilteredUsersSchema,
  uploadUserAvatar: uploadUserAvatarSchema,
  resetPassword: resetPasswordSchema,
  forgotPassword: forgotPasswordSchema,
  getManagerEmployees: getManagerEmployeesSchema,
  addEmployeeToManagerTeam: addEmployeeToManagerTeamSchema,
  removeEmployeeFromManagerTeam: removeEmployeeFromManagerTeamSchema,
};
