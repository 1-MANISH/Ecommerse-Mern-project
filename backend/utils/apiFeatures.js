class ApiFeature{
    constructor(query,queryStr){
        this.query = query // function : X.find() without await
        this.queryStr = queryStr // {key1:value1,key2:value2}    
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            // when we get keyword
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }

        } : {
            // when no keyword mention

        }
        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        let queryCopy = {...this.queryStr}

        const removeFields = ["keyword","page","limit"]
        removeFields.forEach(key=>delete queryCopy[key])


        // filter for Price and rating
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , (key)=>`$${key}`)
        queryCopy = JSON.parse(queryStr)


        this.query = this.query.find(queryCopy)
        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1

        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeature