class APIFeauters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;

    }

    search() {
        const keyword = this.queryStr.keyword || '';

        const nameFilter = {
            name: { $regex: keyword, $options: 'i' }
        };

        this.query.find({...nameFilter});
        return this;
    }

    //Filter

    filter() {
        const queryStrCopy = { ...this.queryStr }

        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field])

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr))
        return this
    }

    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1); // Fix the skip calculation
    
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
    


}

module.exports = APIFeauters;