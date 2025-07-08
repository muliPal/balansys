SELECT
    supplier.name AS supplier_name,
    business.title AS business_title,
    business.tel AS business_tel,
    business.email AS business_email,
    business.address AS business_address,
    business.pin AS business_pin
FROM
    supplier
    LEFT JOIN business ON supplier.business = business.business;
