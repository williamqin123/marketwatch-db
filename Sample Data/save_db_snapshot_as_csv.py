import os, pymysql
import pandas as pd
from dotenv import load_dotenv
from pathlib import Path

if __name__ == "__main__":
    load_dotenv()

    DB_CONNECT_CONFIG = {
        "host": os.environ["DB_HOST"],
        "user": os.environ["DB_USER"],
        "password": os.environ["DB_PASSWORD"],
        "database": os.environ["DB_NAME"],
        "port": int(os.environ["DB_PORT"]),
    }

    out_path = Path(input("Output Folder (Relative): "))

    TABLES_NAMES = {
        "Alert",
        "Ticker",
        "PriceHistory",
    }

    batch_size = 5

    with pymysql.connect(**DB_CONNECT_CONFIG) as conn:
        print("connected")

        cursor = conn.cursor()
        try:

            for tname in TABLES_NAMES:

                cursor.execute(
                    """
                        SELECT COLUMN_NAME
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s;
                    """,
                    (
                        DB_CONNECT_CONFIG["database"],
                        tname,
                    ),
                )

                colnames = []

                while True:
                    rows = cursor.fetchmany(size=batch_size)
                    if not rows:  # Breaks the loop if no more rows are returned
                        break

                    colnames.extend([row[0] for row in rows])

                print(f'{tname} : ({",".join(colnames)})')

                #

                df = pd.DataFrame(columns=colnames)

                cursor.execute(f"SELECT {','.join(colnames)} FROM %s;" % tname)

                i = 0
                while True:
                    rows = cursor.fetchmany(size=batch_size)
                    if not rows:  # Breaks the loop if no more rows are returned
                        break

                    for row in rows:
                        print(row)
                        df.loc[i] = row
                        i += 1

                print(df.info())

                df.to_csv((out_path / f"{tname}.csv").resolve(), index=False)

        except Exception as e:
            conn.rollback()
            print(f"Database query failed: {e}")

        finally:
            cursor.close()
