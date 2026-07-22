const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    featuredImage: {
      url: {
        type: String,
        required: [true, 'Featured image URL is required'],
      },
      publicId: {
        type: String,
        required: [true, 'Featured image public ID is required'],
      },
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      default: 'Baig Tours Team',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    category: {
      type: String,
      required: [true, 'Blog category is required'],
      trim: true,
      default: 'Travel Article',
    },
    tags: {
      type: [String],
      default: [],
    },
    seo: {
      metaTitle: {
        type: String,
        trim: true,
      },
      metaDescription: {
        type: String,
        trim: true,
      },
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Schema Indexing
blogSchema.index({ status: 1, publishDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, content: 1 }, name: 'blog_text_search' }
);

// Pre-validate hook to generate slug from title if missing or modified
blogSchema.pre('validate', async function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    let generatedSlug = slugify(this.title);
    
    // Ensure uniqueness if creating new or modifying title
    const existingBlog = await this.constructor.findOne({
      slug: generatedSlug,
      _id: { $ne: this._id },
    });

    if (existingBlog) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    this.slug = generatedSlug;
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
