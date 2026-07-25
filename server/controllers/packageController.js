const apiResponse = require('../utils/apiResponse');
const Package = require('../models/Package');
const { uploadBuffer } = require('../services/cloudinaryService');

// ---- Public endpoints ----
exports.getPackages = async (req, res) => {
  try {
    const {
      search,
      category,
      destination,
      minPrice,
      maxPrice,
      departureDate,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { status: 'published' };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (destination) {
      filter.destination = destination;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (departureDate) {
      filter.departureDate = { $gte: new Date(departureDate) };
    }

    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'departure_asc') sortOption = { departureDate: 1 };

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [packages, total] = await Promise.all([
      Package.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Package.countDocuments(filter),
    ]);

    return apiResponse(
      res,
      true,
      'Packages fetched successfully',
      packages,
      null,
      200
    );
  } catch (err) {
    return apiResponse(res, false, 'Failed to fetch packages', null, [err.message], 500);
  }
};

exports.getPackageBySlug = async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, status: 'published' });

    if (!pkg) {
      return apiResponse(res, false, 'Package not found', null, [], 404);
    }

    const relatedPackages = await Package.find({
      _id: { $ne: pkg._id },
      category: pkg.category,
      status: 'published',
    }).limit(4);

    return apiResponse(
      res,
      true,
      'Package fetched successfully',
      { ...pkg.toObject(), relatedPackages },
      null,
      200
    );
  } catch (err) {
    return apiResponse(res, false, 'Failed to fetch package', null, [err.message], 500);
  }
};

exports.getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isFeatured: true, status: 'published' });
    return apiResponse(res, true, 'Featured packages fetched', packages, null, 200);
  } catch (err) {
    return apiResponse(res, false, 'Failed to fetch featured packages', null, [err.message], 500);
  }
};

// ---- Admin endpoints ----
exports.getAdminPackages = async (req, res) => {
  try {
    const packages = await Package.find(); // includes drafts
    return apiResponse(res, true, 'All packages fetched', packages, null, 200);
  } catch (err) {
    return apiResponse(res, false, 'Failed to fetch packages', null, [err.message], 500);
  }
};

exports.createPackage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return apiResponse(res, false, 'At least one image is required', null, [], 400);
    }

    const uploads = [];
    for (const file of req.files) {
      const result = await uploadBuffer(file.buffer, 'baig-tours/packages', 'image');
      uploads.push(result);
    }

    const [firstUpload, ...restUploads] = uploads;

    const jsonFields = ['itinerary', 'faqs', 'included', 'excluded', 'highlights', 'seo'];
    const parsedBody = { ...req.body };
    jsonFields.forEach((field) => {
      if (typeof parsedBody[field] === 'string') {
        try {
          parsedBody[field] = JSON.parse(parsedBody[field]);
        } catch (e) {
          // leave as-is if it wasn't actually JSON
        }
      }
    });

    const newPackage = await Package.create({
      ...parsedBody,
      featuredImage: {
        url: firstUpload.url,
        publicId: firstUpload.publicId,
      },
      gallery: restUploads.map((u) => ({
        url: u.url,
        publicId: u.publicId,
        type: 'image',
      })),
    });

    return apiResponse(res, true, 'Package created successfully', newPackage, null, 201);
  } catch (err) {
    return apiResponse(res, false, 'Failed to create package', null, [err.message], 400);
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return apiResponse(res, false, 'Package not found', null, [], 404);
    }
    return apiResponse(res, true, 'Package updated successfully', updated, null, 200);
  } catch (err) {
    return apiResponse(res, false, 'Failed to update package', null, [err.message], 400);
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return apiResponse(res, false, 'Package not found', null, [], 404);
    }
    return apiResponse(res, true, 'Package deleted successfully', null, null, 200);
  } catch (err) {
    return apiResponse(res, false, 'Failed to delete package', null, [err.message], 500);
  }
};

exports.duplicatePackage = async (req, res) => {
  try {
    const original = await Package.findById(req.params.id);
    if (!original) {
      return apiResponse(res, false, 'Package not found', null, [], 404);
    }
    const copy = original.toObject();
    delete copy._id;
    copy.title = `${copy.title} (Copy)`;
    copy.slug = `${copy.slug}-copy-${Date.now()}`;
    copy.status = 'draft';
    const duplicated = await Package.create(copy);
    return apiResponse(res, true, 'Package duplicated successfully', duplicated, null, 201);
  } catch (err) {
    return apiResponse(res, false, 'Failed to duplicate package', null, [err.message], 500);
  }
};

exports.uploadPackageMedia = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return apiResponse(res, false, 'Package not found', null, [], 404);
    }

    if (!req.files || req.files.length === 0) {
      return apiResponse(res, false, 'No files uploaded', null, [], 400);
    }

    const newMedia = [];
    for (const file of req.files) {
      const result = await uploadBuffer(file.buffer, 'baig-tours/packages', 'image');
      newMedia.push({ url: result.url, publicId: result.publicId, type: 'image' });
    }

    pkg.gallery.push(...newMedia);
    await pkg.save();

    return apiResponse(res, true, 'Media uploaded successfully', pkg, null, 200);
  } catch (err) {
    return apiResponse(res, false, 'Failed to upload media', null, [err.message], 500);
  }
};