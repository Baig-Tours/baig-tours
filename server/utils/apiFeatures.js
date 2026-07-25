/**
 * APIFeatures utility class for Mongoose query building.
 * Handles filtering, searching, sorting, field selection, and pagination cleanly across controllers.
 */
class APIFeatures {
  /**
   * @param {Object} mongooseQuery - Mongoose query object (e.g., Model.find())
   * @param {Object} queryString - Express req.query object
   */
  constructor(mongooseQuery, queryString) {
    this.query = mongooseQuery;
    this.queryString = queryString || {};
    this.queryFilter = {};
  }

  /**
   * Filter query parameters
   * @param {Object} baseFilter - Base filter object (e.g., { status: 'published' })
   * @returns {APIFeatures}
   */
  filter(baseFilter = {}) {
    // 1) Copy queryString and remove special reserved control fields
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'tag', 'category'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced operators conversion (gte, gt, lte, lt, in) -> ($gte, $gt, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    const parsedFilter = JSON.parse(queryStr);

    // 3) Handle category & tag if present in query string
    if (this.queryString.category) {
      parsedFilter.category = { $regex: new RegExp(`^${this.queryString.category}$`, 'i') };
    }
    if (this.queryString.tag) {
      parsedFilter.tags = { $in: [this.queryString.tag] };
    }

    // Combine baseFilter and parsed query filters
    this.queryFilter = { ...baseFilter, ...parsedFilter };
    this.query = this.query.find(this.queryFilter);

    return this;
  }

  /**
   * Search feature supporting text search index or multi-field regex
   * @param {Array<string>} searchFields - Fields to search using regex if text search is not used
   * @returns {APIFeatures}
   */
  search(searchFields = []) {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search.trim();

      if (searchFields.length > 0) {
        // Regex search over specified field list
        const regexSearch = searchFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        }));

        this.queryFilter.$or = regexSearch;
        this.query = this.query.find({ $or: regexSearch });
      } else {
        // Mongoose text index search
        this.queryFilter.$text = { $search: searchTerm };
        this.query = this.query.find({ $text: { $search: searchTerm } });
      }
    }
    return this;
  }

  /**
   * Sort results dynamically or by default
   * @param {string|Object} defaultSort - Fallback sort criteria
   * @returns {APIFeatures}
   */
  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else if (this.queryString.search && typeof defaultSort === 'object' && !Array.isArray(defaultSort)) {
      this.query = this.query.sort({ score: { $meta: 'textScore' }, ...defaultSort });
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  /**
   * Select specific fields to return
   * @param {string} defaultFields - Default fields selection string
   * @returns {APIFeatures}
   */
  limitFields(defaultFields = '-__v') {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select(defaultFields);
    }
    return this;
  }

  /**
   * Paginate results
   * @param {number} defaultLimit - Default limit per page
   * @returns {APIFeatures}
   */
  paginate(defaultLimit = 10) {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit, 10) || defaultLimit);
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;
    this.skip = skip;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
