SELECT `date`, SUM(volume) AS total_volume
FROM PriceHistory
WHERE `date` = '2025-11-10'
GROUP BY `date`;
