// models/SubmissionImage.js
import BaseModel from './BaseModel.js';
import Submission from '../models/Submission.js';
import UploadedImage from '../models/UploadedImage.js';



class SubmissionImage extends BaseModel {
  static get tableName() {
    return 'submission_image_table';
  }

  static get idColumn() {
    return ['submission_id', 'image_id']; // composite PK
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['submission_id', 'image_id'],
      properties: {
        submission_id: { type: 'integer' },
        image_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      submission: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Submission,
        join: {
          from: 'submission_image_table.submission_id',
          to: 'submission_table.id',
        },
      },
      image: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UploadedImage,
        join: {
          from: 'submission_image_table.image_id',
          to: 'uploaded_images.id',
        },
      },
    };
  }
}

export default SubmissionImage;
