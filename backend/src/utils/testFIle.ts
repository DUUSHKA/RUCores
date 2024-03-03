// //can use query builder to build queries

// import AppDataSource from "../database/data-source";
// import { UserEntity } from "../database/Entities/userEntity";

// // const user = new User();
// // user.firstName = "John";
// // user.lastName = "Doe";
// // /* Can use AppDataSource.manager.save(user) to save this object. Example below as well
// // in function form  */

// export const createUser = async (
//   firstName: string,
//   lastName: string,
//   isProvider: boolean,
// ) => {
//   const user = new UserEntity();
//   user.firstName = firstName;
//   user.lastName = lastName;
//   user.isProvider = isProvider;
//   await AppDataSource.manager.save(user);
//   return user;
// };

// // But a better way to access the
// // Database would be to use repositories for each entity.

// export const getUsers = async () => {
//   return AppDataSource.getRepository(UserEntity).find();
// };
