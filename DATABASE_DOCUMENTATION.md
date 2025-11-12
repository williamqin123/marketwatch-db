# MarketWatch Database - Technical Documentation

## Database Overview

The MarketWatch Database is a comprehensive stock portfolio management system designed to track users, their investment portfolios, stock holdings, price alerts, and historical price data. The database supports real-time stock tracking, portfolio performance analysis, and automated alert notifications.

---

## Database Schema

### Tables

The database consists of 7 interconnected tables:

1. **User** - Stores user account information
2. **Ticker** - Contains stock ticker information (company details)
3. **PriceHistory** - Historical OHLCV (Open, High, Low, Close, Volume) data
4. **Portfolio** - User-created investment portfolios
5. **Holdings** - Individual stock positions within portfolios
6. **Alert** - Price alerts for stock notifications
7. **AuditLog** - Audit trail for tracking changes

### Entity Relationship Diagram Summary

```
User (1) ----< (M) Portfolio (1) ----< (M) Holdings >---- (1) Ticker
  |                                                           |
  |                                                           |
  +----------< (M) Alert >----------------------------------+
                                                              |
                                                              |
                                                    PriceHistory >---- (1)
```

---

## Trigger: Holdings Audit Log

### Purpose

The `trg_after_holdings_insert` trigger automatically creates audit log entries whenever new stock holdings are added to a portfolio. This provides a complete audit trail for compliance, tracking, and analysis purposes.

### Functionality

**Trigger Name:** `trg_after_holdings_insert`

**Event:** AFTER INSERT on Holdings table

**Timing:** Executes automatically after each new holding is inserted

**Actions:**
1. Retrieves the user_id associated with the portfolio
2. Captures the holding details (ticker, quantity, purchase price)
3. Inserts a new record into the AuditLog table with:
   - Table name: 'Holdings'
   - Operation type: 'INSERT'
   - Complete transaction details
   - Timestamp of the operation

### SQL Implementation

```sql
DROP TRIGGER IF EXISTS trg_after_holdings_insert;

CREATE TRIGGER trg_after_holdings_insert
AFTER INSERT ON Holdings
FOR EACH ROW
BEGIN
    DECLARE v_user_id INT;

    -- Get the user_id from the Portfolio table
    SELECT user_id INTO v_user_id
    FROM Portfolio
    WHERE portfolio_id = NEW.portfolio_id;

    -- Insert audit log entry
    INSERT INTO AuditLog (
        table_name,
        operation_type,
        record_id,
        ticker_symbol,
        quantity,
        purchase_price,
        user_id,
        timestamp
    ) VALUES (
        'Holdings',
        'INSERT',
        NEW.holding_id,
        NEW.ticker_symbol,
        NEW.quantity,
        NEW.purchase_price,
        v_user_id,
        CURRENT_TIMESTAMP
    );
END;
```

### Use Cases

1. **Compliance Tracking**: Maintain a complete history of all investment transactions
2. **Security Auditing**: Track who added what holdings and when
3. **Performance Analysis**: Historical view of when positions were opened
4. **Regulatory Reporting**: Provide audit trail for financial regulations
5. **Data Recovery**: Ability to reconstruct historical portfolio states

### Example Output

When a user adds 100 shares of AAPL at $150.00 to their portfolio, the trigger automatically creates an audit log entry:

```
audit_id: 1
table_name: Holdings
operation_type: INSERT
record_id: 45
ticker_symbol: AAPL
quantity: 100.0000
purchase_price: 150.0000
user_id: 5
timestamp: 2024-11-12 10:30:00
```

---

## Stored Procedure: Get User Portfolio Details

### Purpose

The `sp_GetUserPortfolioDetails` stored procedure provides a comprehensive view of a user's complete investment portfolio, including all holdings, ticker information, and aggregated statistics. This procedure simplifies complex multi-table queries and provides consistent portfolio reporting.

### Functionality

**Procedure Name:** `sp_GetUserPortfolioDetails`

**Input Parameter:**
- `p_user_id` (INT) - The user ID to retrieve portfolio details for

**Output:** Two result sets

**Result Set 1 - Detailed Holdings:**
- User identification (user_id, email, full_name)
- Portfolio information (portfolio_id, name, description)
- Individual holdings (ticker, company name, sector, industry)
- Investment details (quantity, purchase price, purchase date)
- Calculated fields (total investment value per holding)
- Sorted by portfolio name and ticker symbol

**Result Set 2 - Portfolio Summary:**
- Total number of portfolios
- Total number of holdings across all portfolios
- Total portfolio value (sum of all investments)

### SQL Implementation

```sql
DROP PROCEDURE IF EXISTS sp_GetUserPortfolioDetails;

CREATE PROCEDURE sp_GetUserPortfolioDetails(
    IN p_user_id INT
)
BEGIN
    -- Result Set 1: Detailed portfolio holdings
    SELECT
        u.user_id,
        u.email,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        p.portfolio_id,
        p.portfolio_name,
        p.description AS portfolio_description,
        h.holding_id,
        h.ticker_symbol,
        t.company_name,
        t.sector,
        t.industry,
        h.quantity,
        h.purchase_price,
        h.purchase_date,
        (h.quantity * h.purchase_price) AS total_investment_value,
        p.created_at AS portfolio_created_at
    FROM User u
    INNER JOIN Portfolio p ON u.user_id = p.user_id
    INNER JOIN Holdings h ON p.portfolio_id = h.portfolio_id
    INNER JOIN Ticker t ON h.ticker_symbol = t.ticker_symbol
    WHERE u.user_id = p_user_id
    ORDER BY p.portfolio_name, h.ticker_symbol;

    -- Result Set 2: Summary statistics
    SELECT
        COUNT(DISTINCT p.portfolio_id) AS total_portfolios,
        COUNT(h.holding_id) AS total_holdings,
        SUM(h.quantity * h.purchase_price) AS total_portfolio_value
    FROM Portfolio p
    LEFT JOIN Holdings h ON p.portfolio_id = h.portfolio_id
    WHERE p.user_id = p_user_id;
END
```

### Use Cases

1. **Portfolio Dashboard**: Display complete user investment overview
2. **Performance Reporting**: Generate user portfolio reports
3. **API Endpoints**: Backend service for web/mobile applications
4. **Investment Analysis**: Analyze user holdings and diversification
5. **Customer Service**: Quick lookup of user portfolio information

### Example Usage

```sql
-- Get all portfolio details for user ID 5
CALL sp_GetUserPortfolioDetails(5);
```

### Example Output

**Result Set 1:**
```
user_id | email              | full_name    | portfolio_name      | ticker_symbol | company_name | quantity | purchase_price | total_investment_value
--------|-------------------|--------------|---------------------|---------------|--------------|----------|----------------|----------------------
5       | john@example.com  | John Smith   | Growth Portfolio    | AAPL          | Apple Inc.   | 100.00   | 150.0000      | 15000.00
5       | john@example.com  | John Smith   | Growth Portfolio    | MSFT          | Microsoft    | 50.00    | 280.0000      | 14000.00
5       | john@example.com  | John Smith   | Tech Portfolio      | GOOGL         | Alphabet     | 25.00    | 140.0000      | 3500.00
```

**Result Set 2:**
```
total_portfolios | total_holdings | total_portfolio_value
-----------------|----------------|----------------------
2                | 3              | 32500.00
```

### Benefits

1. **Code Reusability**: Centralized logic for portfolio queries
2. **Performance**: Pre-compiled execution plan for faster queries
3. **Security**: Controlled data access through procedure parameters
4. **Consistency**: Ensures same data format across applications
5. **Maintainability**: Single location for portfolio query logic updates

---

## Sample Queries Overview

The database includes 10+ sample queries demonstrating various SQL operations:

### CRUD Operations

1. **CREATE (INSERT)**: `create_a_ticker.sql` - Insert new ticker symbols
2. **READ (SELECT)**: `list_all_tickers.sql` - Retrieve all ticker information
3. **UPDATE**: `update_a_ticker.sql` - Modify existing ticker data
4. **DELETE**: `delete_inactive_alerts.sql` - Remove triggered inactive alerts

### JOIN Operations

5. **Multi-table JOIN**: `join_user_portfolios_holdings.sql` - Display complete user portfolio hierarchy
6. **JOIN with Subquery**: `join_alerts_with_current_prices.sql` - Alert status with latest prices
7. **LEFT JOIN with Aggregation**: `join_portfolio_performance.sql` - Calculate portfolio returns

### Aggregate Functions

8. **AVG + GROUP BY**: `average_close_per_ticker.sql` - Average closing prices by ticker
9. **COUNT + GROUP BY**: `count_of_tickers_by_sector.sql` - Companies per sector
10. **SUM + GROUP BY**: `total_volume_for_a_given_day_across_all_tickers.sql` - Daily trading volume

---

## Data Population

### Python Scripts

The database includes automated Python scripts for populating all tables:

- `insert_tickers.py` - Fetch S&P 500 tickers from Wikipedia
- `insert_price_history.py` - Download historical price data from Yahoo Finance
- `insert_users.py` - Generate fake user accounts
- `insert_portfolios.py` - Create portfolios for users
- `insert_holdings.py` - Add stock holdings to portfolios
- `insert_alerts.py` - Generate price alerts for users

### Master Population Script

`populate_all_tables.py` - Runs all scripts in correct order with progress tracking

---

## Key Features

### Data Integrity

- **Primary Keys**: Auto-increment IDs for all tables
- **Foreign Keys**: Enforced referential integrity
- **Unique Constraints**: Email uniqueness, ticker-date pairs
- **Check Constraints**: Price validation, quantity validation
- **Indexes**: Optimized queries on frequently searched columns

### Business Logic

- **Automatic Auditing**: Trigger-based audit logging
- **Cascading Deletes**: Alert cleanup when users/tickers are removed
- **Calculated Fields**: Portfolio values, investment totals
- **Data Validation**: Price positivity, low ≤ high constraints

### Scalability

- **Indexed Columns**: email, ticker_symbol, date, user_id, portfolio_id
- **Composite Indexes**: (ticker_symbol, date) for price queries
- **Optimized Joins**: Proper foreign key relationships
- **Efficient Aggregation**: Pre-calculated values where appropriate

---

## Technology Stack

- **Database**: MySQL 8.0+
- **Backend API**: FastAPI (Python)
- **Data Sources**: Yahoo Finance, Wikipedia S&P 500
- **Libraries**: pandas, pymysql, yfinance, faker
- **Hosting**: AWS RDS (Amazon Relational Database Service)

---

## Conclusion

The MarketWatch Database provides a robust, scalable solution for portfolio management with comprehensive auditing, automated data population, and optimized query performance. The combination of triggers, stored procedures, and well-designed schema ensures data integrity while maintaining flexibility for future enhancements.
