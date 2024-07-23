class APIFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  filtter() {
    // 1) Filtering
    const queryString = { ...this.queryStr };
    const excludeParameter = ['page', 'fields', 'sort', 'limit'];
    excludeParameter.forEach((ele) => delete queryString[ele]);

    // 2) Advanced Filtering for greaterthan,lessthan,etc...
    let queryStr = JSON.stringify(queryString);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 3) Adding sorting feature
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limit() {
    // 4) Adding field limiting feature
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 5) Adding Pagination feature
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
