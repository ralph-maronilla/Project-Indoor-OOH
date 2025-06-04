// models/User.js
import BaseModel from './BaseModel.js';

class User extends BaseModel {
  static get tableName() {
    return 'sample_users';
  }

  static get idColumn() {
    return 'id';
  }
}

export default User;
