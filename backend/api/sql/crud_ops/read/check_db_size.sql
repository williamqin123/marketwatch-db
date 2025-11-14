SELECT
    SUM(ROUND(((data_length + index_length) / 1024 / 1024), 2)) AS 'Total Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = %(db_name)s;
