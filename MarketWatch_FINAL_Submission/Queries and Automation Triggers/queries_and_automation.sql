USE marketwatchDB;

-- Create 
INSERT INTO Ticker (ticker_symbol, company_name, sector, industry, country)
VALUES ('NVDA', 'NVIDIA Corporation', 'Technology', 'Semiconductors', 'USA');

-- Read
SELECT ticker_symbol, company_name, sector, industry
FROM Ticker
WHERE sector = 'Information Technology' AND ticker_symbol LIKE 'N%';

-- Update
UPDATE Ticker
SET industry = 'Artificial Intelligence'
WHERE ticker_symbol = 'NVDA';

-- Delete
DELETE FROM Alert
WHERE is_active = 0 AND triggered_at IS NOT NULL;

SELECT ticker_symbol, company_name, sector, industry
FROM Ticker
WHERE sector = 'Information Technology'
  AND ticker_symbol LIKE 'N%';
  
--  queries and automation ----------------------------------------------------
  
  -- A report query using a JOIN to report on an aggregate value with a GROUP BY clause.
WITH latest AS (SELECT ph1.ticker_symbol, ph1.close_price AS last_close
FROM PriceHistory ph1
JOIN (SELECT ticker_symbol, MAX(`date`) AS max_date
FROM PriceHistory
GROUP BY ticker_symbol) m ON m.ticker_symbol = ph1.ticker_symbol AND m.max_date      = ph1.`date`)
SELECT p.portfolio_id,
       p.portfolio_name,
       ROUND(SUM(h.quantity * l.last_close),2) AS portfolio_value
FROM Portfolio p
JOIN Holdings h ON h.portfolio_id = p.portfolio_id
LEFT JOIN latest l ON l.ticker_symbol = h.ticker_symbol
GROUP BY p.portfolio_id, p.portfolio_name
ORDER BY portfolio_value DESC;
  
  -- A query with a subquery.
SELECT ticker_symbol,
ROUND(AVG(close_price), 2) AS avg_close FROM PriceHistory
GROUP BY ticker_symbol
HAVING AVG(close_price) > (SELECT AVG(close_price) FROM PriceHistory);

-- A query to create a view and another query to demonstrate its use.
CREATE OR REPLACE VIEW v_ticker_latest_price AS
WITH latest AS (SELECT ph1.ticker_symbol, ph1.close_price AS last_close, ph1.`date` AS last_date FROM PriceHistory ph1
JOIN (SELECT ticker_symbol, MAX(`date`) AS max_date
FROM PriceHistory
GROUP BY ticker_symbol) m ON m.ticker_symbol = ph1.ticker_symbol AND m.max_date      = ph1.`date`)
SELECT t.ticker_symbol,
t.company_name,
t.sector,
latest.last_close,
latest.last_date
FROM Ticker t
LEFT JOIN latest ON latest.ticker_symbol = t.ticker_symbol;


-- A trigger that updates or inserts data based on an insert.
DROP TRIGGER IF EXISTS tr_holdings_ai;
DELIMITER //
CREATE TRIGGER tr_holdings_ai
AFTER INSERT ON Holdings
FOR EACH ROW
BEGIN
INSERT INTO AuditLog(table_name,operation_type,record_id,ticker_symbol,quantity,purchase_price,user_id,`timestamp`)
VALUES('Holdings','INSERT',NEW.holding_id,NEW.ticker_symbol,NEW.quantity,NEW.purchase_price,
(SELECT user_id FROM Portfolio WHERE portfolio_id = NEW.portfolio_id),
NOW());
END//
DELIMITER ;

-- A query to demonstrate the trigger's functionality.
INSERT INTO Holdings (portfolio_id, ticker_symbol, quantity, purchase_price, purchase_date)
VALUES (
(SELECT portfolio_id FROM Portfolio LIMIT 1),
(SELECT ticker_symbol FROM Ticker   LIMIT 1),
1.0000,
220.00,
CURDATE());  
  