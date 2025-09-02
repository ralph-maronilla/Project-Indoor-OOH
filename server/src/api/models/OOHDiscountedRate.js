import { Model } from 'objection';
import OohDetails from '../models/OOHDetails.js';

class OohDiscountedRate extends Model {
  static get tableName() {
    return 'ooh_discounted_rate';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      details: {
        relation: Model.BelongsToOneRelation,
        modelClass: OohDetails,
        join: {
          from: 'ooh_discounted_rate.details_id',
          to: 'ooh_details.id'
        }
      }
    };
  }
}

export default OohDiscountedRate;
