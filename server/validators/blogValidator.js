const { body, param, query } = require('express-validator');

const createBlogValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Blog content is required')
    .isString()
    .withMessage('Content must be a string'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string'),
  body('featuredImage')
    .custom((value) => {
      if (!value || typeof value !== 'object') {
        throw new Error('Featured image object with url and publicId is required');
      }
      if (!value.url || !value.publicId) {
        throw new Error('Featured image must contain both url and publicId');
      }
      return true;
    }),
  body('author')
    .optional()
    .isString()
    .withMessage('Author must be a string'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  body('seo.metaTitle')
    .optional()
    .isString()
    .withMessage('Meta title must be a string'),
  body('seo.metaDescription')
    .optional()
    .isString()
    .withMessage('Meta description must be a string'),
];

const updateBlogValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Blog ID'),
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .optional()
    .isString()
    .withMessage('Content must be a string'),
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  body('featuredImage')
    .optional()
    .custom((value) => {
      if (value && (typeof value !== 'object' || !value.url || !value.publicId)) {
        throw new Error('Featured image must be an object with url and publicId');
      }
      return true;
    }),
  body('author')
    .optional()
    .isString()
    .withMessage('Author must be a string'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  body('seo.metaTitle')
    .optional()
    .isString()
    .withMessage('Meta title must be a string'),
  body('seo.metaDescription')
    .optional()
    .isString()
    .withMessage('Meta description must be a string'),
];

module.exports = {
  createBlogValidation,
  updateBlogValidation,
};
