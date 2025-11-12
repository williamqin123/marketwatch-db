-- JOIN Operation: Display users with their portfolios and holdings
-- Demonstrates INNER JOIN across multiple tables (User -> Portfolio -> Holdings -> Ticker)

SELECT
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    u.email,
    p.portfolio_name,
    h.ticker_symbol,
    t.company_name,
    h.quantity,
    h.purchase_price,
    (h.quantity * h.purchase_price) AS total_investment
FROM User u
INNER JOIN Portfolio p ON u.user_id = p.user_id
INNER JOIN Holdings h ON p.portfolio_id = h.portfolio_id
INNER JOIN Ticker t ON h.ticker_symbol = t.ticker_symbol
ORDER BY u.user_id, p.portfolio_name, h.ticker_symbol;
