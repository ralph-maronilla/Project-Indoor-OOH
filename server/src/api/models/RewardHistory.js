import BaseModel from './BaseModel.js';

export default class RewardHistory extends BaseModel {
    static get tableName() {
        return 'rewards_history_table';
    }


     static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
required: [
  'user_email',
  'user_fullname',
  'user_mobilenumber',
  'reward_amount',
  'reward_description',
  'reward_receipt',
  'reward_reference_number'
],
      properties: {
        id: { type: 'integer' },
        user_email: { type: 'string' },
        user_fullname: { type: 'string' }, 
        user_mobilenumber: { type: 'string' },
        reward_amount: { type: 'string' },
        reward_description: { type: 'string' },
        reward_receipt: { type: 'string' },
        reward_reference_number: { type: 'string' },
      },
    };
  }
}



