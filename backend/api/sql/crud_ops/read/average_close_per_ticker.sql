SELECT ticker_symbol, ROUND(AVG(close_price),2) AS avg_close
FROM PriceHistory
GROUP BY ticker_symbol
ORDER BY avg_close DESC;
