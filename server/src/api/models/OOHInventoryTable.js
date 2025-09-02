import { Model } from 'objection';
import OohAddress from '../models/OOHAddress.js';
import OohDimensions from '../models/OOHDimensions.js';
import OohDetails from '../models/OOHDetails.js';

class OohInventory extends Model {
  static get tableName() {
    return 'ooh_inventory_table';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      address: {
        relation: Model.HasOneRelation,
        modelClass: OohAddress,
        join: {
          from: 'ooh_inventory_table.id',
          to: 'ooh_address.inventory_id'
        }
      },
      dimensions: {
        relation: Model.HasOneRelation,
        modelClass: OohDimensions,
        join: {
          from: 'ooh_inventory_table.id',
          to: 'ooh_dimensions.inventory_id'
        }
      },
      details: {
        relation: Model.HasOneRelation,
        modelClass: OohDetails,
        join: {
          from: 'ooh_inventory_table.id',
          to: 'ooh_details.inventory_id'
        }
      }
    };
  }
}

export default OohInventory;
