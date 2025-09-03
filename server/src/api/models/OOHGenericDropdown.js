import { Model } from 'objection';

class OohGenericDropdown extends Model {
  static get tableName() {
    return 'project_indoor_ooh.ooh_generic_dropdown_data';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'category'],
      properties: {
        id: { type: 'integer' },
        data_name: { type: 'string' },
        data_category: { type: 'string' },
      },
    };
  }
}

export default OohGenericDropdown;
