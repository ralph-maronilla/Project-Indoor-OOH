// models/UploadedImage.js
import BaseModel from './BaseModel.js';

class UploadedImage extends BaseModel {
  static get tableName() {
    return 'uploaded_images';
  }

  static get idColumn() {
    return 'id';
  }

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Defines the JSON schema for the model.
   * @typedef {Object} UploadedImageJSONSchema
   * @property {number} id - The ID of the uploaded image.
   * @property {number} [user_id] - The ID of the user who uploaded the image.
   * @property {string} filename - The original filename of the image.
   * @property {string} mime_type - The MIME type of the image.
   * @property {string} created_at - The timestamp when the image was uploaded.
   */
/*******  289eb37c-eeb8-4c1b-97a4-c3cc48648d0c  *******/
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['filename', 'mime_type', 'image_data'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: ['integer', 'null'] },
        filename: { type: 'string' },
        mime_type: { type: 'string' },
        // image_data: { type: 'string' }, ❌ Remove or comment this
        created_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}

export default UploadedImage;
