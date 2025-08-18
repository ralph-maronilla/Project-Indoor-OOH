// models/UploadedImage.js
import BaseModel from './BaseModel.js';
import Submission from '../models/Submission.js'; // assuming you'll have this model
import SubmissionImage from '../models/SubmissionImage.js'; // junction table model

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
        filename: { type: 'string', minLength: 1, maxLength: 255 },
        mime_type: { type: 'string', minLength: 1, maxLength: 100 },
image_data: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        image_exif_data: { type: ['string', 'null'] },
        
      },
    };
  }

  static get relationMappings() {
    return {
      submissions: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Submission,
        join: {
          from: 'uploaded_images.id',
          through: {
            from: 'submission_image_table.image_id',
            to: 'submission_image_table.submission_id',
          },
          to: 'submission_table.id',
        },
      },
      submissionLinks: {
        relation: BaseModel.HasManyRelation,
        modelClass: SubmissionImage,
        join: {
          from: 'uploaded_images.id',
          to: 'submission_image_table.image_id',
        },
      },
    };
  }

  // $beforeInsert() {
  //   this.created_at = new Date().toISOString();
  // }
}

export default UploadedImage;
