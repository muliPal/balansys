-- SELECT
--     CONCAT('http://localhost/balansys/images/', folder.name, '/', image.name) AS image_name,
--     image.picture AS image_picture,
--     CONCAT('http://localhost/balansys/images/', folder.name, '/', image.name) AS path,
--     NULL AS `match`,
--     NULL AS comment
-- FROM
--     image
-- LEFT JOIN folder ON image.folder = folder.folder
-- LIMIT 1;
select
 name
from image
limit 20;