import BaseModel from './BaseModel.js';

class OohAddress extends BaseModel {
  static get tableName() {
    return 'ooh_address';
  }

  static get idColumn() {
    return 'id';
  }
}

export default OohAddress;
