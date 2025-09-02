import { Model } from 'objection';
import OohInventory from '../models/OOHInventoryTable.js';
import OohDiscountedRate from '../models/OOHDiscountedRate.js';

class OohDetails extends Model {
  static get tableName() {
    return 'ooh_details';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      inventory: {
        relation: Model.BelongsToOneRelation,
        modelClass: OohInventory,
        join: {
          from: 'ooh_details.inventory_id',
          to: 'ooh_inventory_table.id'
        }
      },
      discountedRate: {
        relation: Model.HasOneRelation,
        modelClass: OohDiscountedRate,
        join: {
          from: 'ooh_details.id',
          to: 'ooh_discounted_rate.details_id'
        }
      }
    };
  }
}

export default OohDetails;
