
  class APIFeatures{
    constructor(query,queryString){
      this.query = query;
      this.queryString = queryString;
    }
     //1A.filtering
     filter(){
      const queryObj ={...this.queryString};
      const excludeFields= ['page','sort','limit','fields'];
      excludeFields.forEach(el => delete queryObj[el]);
         
     //1B.advanced filtering
     let queryStr = JSON.stringify(queryObj);
     queryStr= queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match =>`$${match}`);
     
     this.query=this.query.find(JSON.parse(queryStr)); 
    return this;
    }
      //2. Sorting
      sort(){
        if(this.queryString.sort){
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        }else{
         this.query = this.query.sort('name');
        }
        return this;
      }
    
       //3. limiting fields
       limitFields(){
        if(this.queryString.fields){
          const fields = this.queryString.fields.split(',').join(' ');
          this.query= this.query.select(fields);
        }else{
          this.query= this.query.select('-__v');
        }
        return this;
       }
      paginate(){
        
        //4. Pagination
        const page = this.queryString.page *1 || 1;
        const limit = this.queryString.limit *1 || 100;
        const skip = (page - 1) * limit;
  
        this.query = this.query.skip(skip).limit(limit);
        return this;
      }     
  }

  module.exports = APIFeatures;