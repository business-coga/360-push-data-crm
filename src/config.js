module.exports = {
    query : {
        getProfileByPagination : function (pageSize,page){
            let LIMIT = pageSize
            let OFFSET = page*pageSize

            return `SELECT * FROM dbo.Profile 
            
            
            
            LIMIT=${LIMIT} 
            OFFSET=${OFFSET}`
        },
        getPageProfile : function(pageSize){
            return `SELECT COUNT(*)/${pageSize} FROM consolidate.cust_profile`
        }
    }
}