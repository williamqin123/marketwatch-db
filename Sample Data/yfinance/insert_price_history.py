import os
import pymysql
import yfinance as yf
import pandas as pd
from dotenv import load_dotenv
from tqdm import tqdm
import time

load_dotenv()

DB_CONFIG = {
    "host": os.getenv(
        "DB_HOST", "main-marketwatch-db.c74uqiecyemg.us-east-2.rds.amazonaws.com"
    ),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "admin"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME", "portfolio_db"),
}


def get_connection():
    return pymysql.connect(**DB_CONFIG)


def get_tickers():
    conn = get_connection()
    df = pd.read_sql("SELECT ticker_symbol FROM Ticker;", conn)
    conn.close()
    return df["ticker_symbol"].tolist()


def fetch_hourly_data(ticker):
    """Fetch 1 year of hourly price data for a given ticker safely."""
    try:
        data = yf.download(
            ticker, period="1y", interval="1h", progress=False, auto_adjust=False
        )
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")
        return pd.DataFrame()

    if data.empty:
        print(f"No data returned for {ticker}")
        return pd.DataFrame()

    # Flatten multi-index columns if present
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [col[0] for col in data.columns]

    # Rename and clean
    rename_map = {
        "Open": "open_price",
        "High": "high_price",
        "Low": "low_price",
        "Close": "close_price",
        "Volume": "volume",
    }
    for old_col in rename_map:
        if old_col not in data.columns:
            print(f"Skipping {ticker}: missing '{old_col}' column")
            return pd.DataFrame()

    data = data.reset_index().rename(columns=rename_map)
    data = data.dropna(
        subset=["open_price", "high_price", "low_price", "close_price", "volume"]
    )
    data = data[data["volume"] > 0]
    data["ticker_symbol"] = ticker

    return data[
        [
            "ticker_symbol",
            "Datetime",
            "open_price",
            "high_price",
            "low_price",
            "close_price",
            "volume",
        ]
    ].rename(columns={"Datetime": "date"})


def insert_price_history(df):
    if df.empty:
        return

    # Replace NaNs with None for MySQL
    df = df.replace({pd.NA: None, float("nan"): None})

    max_retries = 3
    retry_count = 0

    while retry_count < max_retries:
        try:
            conn = get_connection()
            cursor = conn.cursor()
            sql = """
                  INSERT INTO PriceHistory (ticker_symbol, date, open_price, high_price, low_price, close_price, volume)
                  VALUES (%s, %s, %s, %s, %s, %s, %s)
                      ON DUPLICATE KEY UPDATE
                                           open_price = VALUES(open_price),
                                           high_price = VALUES(high_price),
                                           low_price = VALUES(low_price),
                                           close_price = VALUES(close_price),
                                           volume = VALUES(volume); \
                  """
            cursor.executemany(sql, df.values.tolist())
            conn.commit()
            cursor.close()
            conn.close()
            return  # Success, exit the function
        except Exception as e:
            retry_count += 1
            error_msg = str(e)
            if "gone away" in error_msg or "BrokenPipe" in error_msg:
                print(f"Connection lost for {df['ticker_symbol'].iloc[0]}, retrying ({retry_count}/{max_retries})...")
                time.sleep(2)  # Wait before retry
                try:
                    cursor.close()
                    conn.close()
                except:
                    pass
            else:
                print(f"Insert error for {df['ticker_symbol'].iloc[0]}: {e}")
                try:
                    conn.rollback()
                    cursor.close()
                    conn.close()
                except:
                    pass
                return  # Exit on non-connection errors


def check_ticker_has_data(ticker):
    """Check if ticker already has price history data"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM PriceHistory WHERE ticker_symbol = %s", (ticker,))
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return count > 0
    except:
        return False

if __name__ == "__main__":
    tickers = get_tickers()
    print(f"Fetching hourly data for {len(tickers)} tickers (1 year)\n")

    # Check which tickers already have data
    tickers_to_fetch = []
    for ticker in tickers:
        if not check_ticker_has_data(ticker):
            tickers_to_fetch.append(ticker)

    if len(tickers_to_fetch) < len(tickers):
        print(f"Resuming: {len(tickers_to_fetch)} tickers remaining (skipping {len(tickers) - len(tickers_to_fetch)} already loaded)\n")

    for ticker in tqdm(tickers_to_fetch):
        df = fetch_hourly_data(ticker)
        if not df.empty:
            insert_price_history(df)
        time.sleep(1)  # Prevent Yahoo rate limiting

    print("\nPrice history insertion completed successfully.")
