-- JOIN Operation: Show user alerts with current stock prices
-- Demonstrates INNER JOIN with subquery to get the latest price for comparison

SELECT
    u.email AS user_email,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    a.ticker_symbol,
    t.company_name,
    a.alert_type,
    a.target_price,
    latest_price.current_price,
    CASE
        WHEN a.alert_type = 'ABOVE' AND latest_price.current_price >= a.target_price THEN 'TRIGGERED'
        WHEN a.alert_type = 'BELOW' AND latest_price.current_price <= a.target_price THEN 'TRIGGERED'
        ELSE 'PENDING'
    END AS alert_status,
    a.is_active
FROM Alert a
INNER JOIN User u ON a.user_id = u.user_id
INNER JOIN Ticker t ON a.ticker_symbol = t.ticker_symbol
INNER JOIN (
    -- Subquery to get the most recent price for each ticker
    SELECT ticker_symbol, close_price AS current_price
    FROM PriceHistory ph1
    WHERE date = (
        SELECT MAX(date)
        FROM PriceHistory ph2
        WHERE ph2.ticker_symbol = ph1.ticker_symbol
    )
) AS latest_price ON a.ticker_symbol = latest_price.ticker_symbol
WHERE a.is_active = TRUE
ORDER BY u.user_id, a.ticker_symbol;
