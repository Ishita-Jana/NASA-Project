// making any endpoint paginated
const DEFAULT_PAGE_NUMBER = 1; 
const DEFAULT_PAGE_LIMIT = 0; // returns all results
function getPagination(query){
   
    //if no params then they will take the OR value
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

    return {
        skip: limit * (page - 1),
        limit: limit}

}


module.exports = {

    getPagination
};