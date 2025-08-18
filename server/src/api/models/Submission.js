// models/Submission.js
import BaseModel from './BaseModel.js';
import UploadedImage from './UploadedImage.js';
import SubmissionImage from './SubmissionImage.js';

class Submission extends BaseModel {
  static get tableName() {
    return 'submission_table';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['submitted_by'],
      properties: {
        id: { type: 'integer' },
        submitted_by: { type: 'integer' },
        submitted_at: { type: 'string', format: 'date-time' }, // DB default
        approved_by: { type: ['integer', 'null'] },
        approved_at: { type: ['string', 'null'], format: 'date-time' },
        isApproved: { type: 'boolean' },
        status: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      images: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: UploadedImage,
        join: {
          from: 'submission_table.id',
          through: {
            from: 'submission_image_table.submission_id',
            to: 'submission_image_table.image_id',
          },
          to: 'uploaded_images.id',
        },
      },
      imageLinks: {
        relation: BaseModel.HasManyRelation,
        modelClass: SubmissionImage,
        join: {
          from: 'submission_table.id',
          to: 'submission_image_table.submission_id',
        },
      },
    };
  }

  $beforeInsert() {
    // Let MySQL handle submitted_at unless explicitly provided
    if (this.submitted_at) {
      this.submitted_at = new Date(this.submitted_at).toISOString();
    }
    if (typeof this.isApproved === 'undefined') {
      this.isApproved = false;
    }
  }
}

export default Submission;
