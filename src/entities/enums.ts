import { StringEnum } from 'src/framework/utils';

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const UserTypeEnumSchema = StringEnum(UserTypeEnum, {
  $id: 'UserTypeEnum',
});
