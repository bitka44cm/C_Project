import { dbContext } from '../db/dbContext';

export const getTransaction = async () => {
  const sequelize = dbContext.getSequelize();
  const transaction = await sequelize.transaction();
  return transaction;
};
