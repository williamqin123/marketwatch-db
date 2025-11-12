-- JOIN Operation: Calculate portfolio performance by comparing purchase price to current price
-- Demonstrates LEFT JOIN with aggregation and calculated fields

SELECT
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    p.portfolio_id,
    p.portfolio_name,
    COUNT(h.holding_id) AS total_holdings,
    SUM(h.quantity * h.purchase_price) AS total_invested,
    SUM(h.quantity * COALESCE(latest_price.current_price, h.purchase_price)) AS current_value,
    SUM(h.quantity * COALESCE(latest_price.current_price, h.purchase_price)) -
        SUM(h.quantity * h.purchase_price) AS total_gain_loss,
    ROUND(
        ((SUM(h.quantity * COALESCE(latest_price.current_price, h.purchase_price)) -
          SUM(h.quantity * h.purchase_price)) /
         SUM(h.quantity * h.purchase_price)) * 100,
        2
    ) AS percent_change
FROM User u
INNER JOIN Portfolio p ON u.user_id = p.user_id
LEFT JOIN Holdings h ON p.portfolio_id = h.portfolio_id
LEFT JOIN (
    -- Get the latest closing price for each ticker
    SELECT ticker_symbol, close_price AS current_price
    FROM PriceHistory ph1
    WHERE date = (
        SELECT MAX(date)
        FROM PriceHistory ph2
        WHERE ph2.ticker_symbol = ph1.ticker_symbol
    )
) AS latest_price ON h.ticker_symbol = latest_price.ticker_symbol
GROUP BY u.user_id, p.portfolio_id, p.portfolio_name, u.first_name, u.last_name
ORDER BY percent_change DESC;
