class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // for searching
  search() {
    let keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });

    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    //Filter for category
    const removeFields = ["page", "keyword", "limit"];
    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    //Filter for price
    this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resultperPage) {
    let currentPage = Number(this.queryStr.page) || 1;
    let skipPages = resultperPage * (currentPage - 1);
    this.query = this.query.skip(skipPages).limit(resultperPage);
    return this;
  }
}

module.exports = Apifeatures;
