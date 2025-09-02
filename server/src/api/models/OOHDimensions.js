import { Model } from 'objection';
import OohInventory from '../models/OOHInventoryTable.js';

class OohDimensions extends Model {
  static get tableName() {
    return 'ooh_dimensions';
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
          from: 'ooh_dimensions.inventory_id',
          to: 'ooh_inventory_table.id'
        }
      }
    };
  }
}

export default OohDimensions;
