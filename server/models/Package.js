const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;

const itinerarySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    details: { type: String },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
  },
  { _id: false }
);

const seoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
  },
  { _id: false }
);

const packageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    slug: { type: String, unique: true },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },

    duration: { type: String, required: true }, // e.g. "5 Days / 4 Nights"
    tourType: { type: String, enum: ['Domestic', 'International'] },

    availableSeats: { type: Number, required: true, min: 0 },

    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    pickupLocation: { type: String },
    hotelInfo: { type: String },
    transportation: { type: String },
    mealsIncluded: { type: String },

    description: { type: String, required: true },

    highlights: [{ type: String }],
    included: [{ type: String }],
    excluded: [{ type: String }],

    itinerary: [itinerarySchema],
    faqs: [faqSchema],

    featuredImage: {
      type: {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
      required: true,
    },

    gallery: [mediaSchema],

    seo: seoSchema,

    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for how the frontend actually queries packages (Section 2.4)
packageSchema.index({ destination: 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ price: 1 });

// Auto-generate a unique slug from the title before saving
packageSchema.pre('save', async function (next) {
  if (!this.isModified('title') && this.slug) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let candidate = baseSlug;
  let counter = 1;

  const PackageModel = this.constructor;
  // Ensure uniqueness — append -2, -3, ... on collision
  while (
    await PackageModel.exists({ slug: candidate, _id: { $ne: this._id } })
  ) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  this.slug = candidate;
  next();
});

module.exports = mongoose.model('Package', packageSchema);