module.exports = {
    query : {
        getProfileByPagination : function (pageSize,page){
            let LIMIT = pageSize
            let OFFSET = page*pageSize

            return `SELECT 
            'customer_360' AS SourceSystem,
            CP.cust_profile_id::VARCHAR(1000) SourceSystemReferenceValue,
            CASE
                WHEN CP.first_name IS NULL THEN 'UNKNOWN'
                WHEN CP.first_name = '' THEN 'UNKNOWN'
                ELSE regexp_replace(REPLACE(REPLACE(CP.first_name, ',',''),'\n',''), E'[\\n\\r]+', ' ', 'g')
            END AS FirstName,
            CASE
                WHEN CP.last_name IS NULL THEN 'UNKNOWN'
                WHEN CP.last_name = '' THEN 'UNKNOWN'
                ELSE regexp_replace(REPLACE(CP.last_name, ',',''), E'[\\n\\r]+', ' ', 'g')
            END AS LastName,
            CASE 
                WHEN CP.date_of_brith IS NULL THEN ''
                ELSE  TO_CHAR(CP.date_of_brith :: DATE, 'yyyy-mm-dd')::VARCHAR(1000)
            END AS DateOfBirth,
            '' MobileCountryCode,
            CASE
                WHEN CPH.E1 IS NULL THEN ''
                ELSE regexp_replace(CPH.E1::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS MobileNumber,
            CASE
                WHEN CE.E1 IS NULL THEN ''
                ELSE regexp_replace(CE.E1::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS EmailAddress,
            '' JobTitle,
            '' PersonDEO_Gender_c,
            '' AddressLine1,
            '' AddressLine2,
            '' City,
            '' "State",
            'VN' Country,
            '' PersonDEO_IDNumber_c,
            '' PersonDEO_IDIssueDate_c,
            '' PersonDEO_IDValidityDate_c,
            '' PersonDEO_CreatedBySourceSystem_c,
            CASE
                WHEN CE.E2 IS NULL THEN ''
                ELSE regexp_replace(CE.E2::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS PersonDEO_EmailAddress2_c,
            CASE
                WHEN CE.E3 IS NULL THEN ''
                ELSE regexp_replace(CE.E3::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS PersonDEO_EmailAddress3_c,
            CASE
                WHEN CPH.E2 IS NULL THEN ''
                ELSE regexp_replace(CPH.E2::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS PersonDEO_MobileNumber2_c,
            CASE
                WHEN CPH.E3 IS NULL THEN ''
                ELSE regexp_replace(CPH.E3::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS PersonDEO_MobileNumber3_c
            FROM(
                SELECT * FROM (
                SELECT ROW_NUMBER () OVER (ORDER BY cust_profile_id) r_n, *
                FROM consolidate.cust_profile
                ) AS X
                LIMIT ${LIMIT}
                OFFSET ${OFFSET}
            ) CP
            LEFT JOIN (
            SELECT E1.cust_profile_id,
            CASE
                WHEN E1.E1 IS NULL THEN ''
                ELSE regexp_replace(E1.E1::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS E1,
            CASE
                WHEN E2.E2 IS NULL THEN ''
                ELSE regexp_replace(E2.E2::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS E2,
            CASE
                WHEN E3.E3 IS NULL THEN ''
                ELSE regexp_replace(E3.E3::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS E3
            FROM (
                SELECT sub.cust_profile_id,sub.email AS E1
                FROM (
                SELECT cust_profile_id,email, ROW_NUMBER () OVER (
                        PARTITION BY cust_profile_id
                        ORDER BY
                            email
                    ) AS rn
                FROM consolidate.cust_email
                ) sub
                WHERE sub.rn = 1
            ) E1
            LEFT JOIN (
                SELECT sub.cust_profile_id,sub.email AS E2
                FROM (
                SELECT cust_profile_id,email, ROW_NUMBER () OVER (
                        PARTITION BY cust_profile_id
                        ORDER BY
                            email
                    ) AS rn
                FROM consolidate.cust_email
                ) sub
                WHERE sub.rn = 2
            ) E2 ON E1.cust_profile_id = E2.cust_profile_id
            LEFT JOIN (
                SELECT sub.cust_profile_id,sub.email AS E3
                FROM (
                SELECT cust_profile_id,email, ROW_NUMBER () OVER (
                        PARTITION BY cust_profile_id
                        ORDER BY
                            email
                    ) AS rn
                FROM consolidate.cust_email
                ) sub
                WHERE sub.rn = 3
            ) E3 ON E1.cust_profile_id = E3.cust_profile_id
            ) AS CE ON CE.cust_profile_id = CP.cust_profile_id
            
            LEFT JOIN (
            SELECT E1.cust_profile_id,
            CASE
                WHEN E1.E1 IS NULL THEN ''
                ELSE regexp_replace(E1.E1::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS E1,
            CASE
                WHEN E2.E2 IS NULL THEN ''
                ELSE regexp_replace(E2.E2::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS E2,
            CASE
                WHEN E3.E3 IS NULL THEN ''
                ELSE regexp_replace(E3.E3::VARCHAR(500),E'[\\n\\r]+', ' ', 'g')
            END AS E3
            FROM (
                SELECT sub.cust_profile_id,sub.phone AS E1
                FROM (
                SELECT cust_profile_id,phone, ROW_NUMBER () OVER (
                        PARTITION BY cust_profile_id
                        ORDER BY
                            phone
                    ) AS rn
                FROM consolidate.cust_phone
                ) sub
                WHERE sub.rn = 1
            ) E1
            LEFT JOIN (
                SELECT sub.cust_profile_id,sub.phone AS E2
                FROM (
                SELECT cust_profile_id,phone, ROW_NUMBER () OVER (
                        PARTITION BY cust_profile_id
                        ORDER BY
                            phone
                    ) AS rn
                FROM consolidate.cust_phone
                ) sub
                WHERE sub.rn = 2
            ) E2 ON E1.cust_profile_id = E2.cust_profile_id
            LEFT JOIN (
                SELECT sub.cust_profile_id,sub.phone AS E3
                FROM (
                SELECT cust_profile_id,phone, ROW_NUMBER () OVER (
                        PARTITION BY cust_profile_id
                        ORDER BY
                            phone
                    ) AS rn
                FROM consolidate.cust_phone
                ) sub
                WHERE sub.rn = 3
            ) E3 ON E1.cust_profile_id = E3.cust_profile_id
            ) AS CPH ON CPH.cust_profile_id = CP.cust_profile_id
            ORDER BY CP.cust_profile_id DESC
            `
        },
        getPageProfile : function(pageSize){
            return `SELECT COUNT(*)/${pageSize} + 1 AS "PAGE_COUNT" FROM consolidate.cust_profile`
        }
    },
    pageSize : 10000
}