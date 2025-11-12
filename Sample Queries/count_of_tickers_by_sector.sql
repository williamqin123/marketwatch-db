SELECT sector, COUNT(*) AS companies
FROM Ticker
GROUP BY sector
ORDER BY companies DESC;
