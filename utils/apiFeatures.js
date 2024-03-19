class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1) Filtering
  filter() {
    // 1A) filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|let|lt\b)/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    this.query = this.query.find(queryStr);

    // return the entire object
    return this;
  }

  // 2) Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    // When no sort param was specified, sort by -createdAt
    else {
      this.query.sort('-createdAt');
    }

    // return the entire object
    return this;
  }

  // 3) Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    // When no field limiting, only remove __v
    else {
      this.query = this.query.select('-__v');
    }

    // Return the entire object
    return this;
  }

  // 4) Pagination
  paginate() {
    const limit = +this.queryString.limit || 100;
    const page = +this.queryString.page || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // Return the entire object
    return this;
  }
}

module.exports = APIFeatures;
