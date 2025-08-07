// models/UploadedImage.js
import BaseModel from './BaseModel.js';

class UploadedImage extends BaseModel {
  static get tableName() {
    return 'uploaded_images';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['filename', 'mime_type', 'image_data'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: ['integer', 'null'] },
        filename: { type: 'string' },
        mime_type: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        image_exif_data : { type: 'string' },
      },
    };
  }
}

export default UploadedImage;
