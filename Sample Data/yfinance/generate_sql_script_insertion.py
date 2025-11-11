import glob, pymysql, os
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

GENERATED_SQL_FILE_PATH = "../../backend/api/sql/insert_sample_data.generated.sql"


if __name__ == "__main__":
    load_dotenv()

    DB_CONNECT_CONFIG = {
        "host": os.environ["DB_HOST"],
        "user": os.environ["DB_USER"],
        "password": os.environ["DB_PASSWORD"],
        "database": os.environ["DB_NAME"],
        "port": int(os.environ["DB_PORT"]),
    }

    csv_files_paths = glob.glob("data/tables/*.csv")

    with pymysql.connect(**DB_CONNECT_CONFIG) as conn:
        print("connected")
        cursor = conn.cursor()

        try:
            with open(GENERATED_SQL_FILE_PATH, "w") as sql_file:

                for csv_file_path in csv_files_paths:
                    # 1 table
                    df = pd.read_csv(csv_file_path)

                    template_slots = ("%s," * df.shape[1])[:-1]

                    for index, row in df.iterrows():
                        # 1 row
                        print(
                            cursor.mogrify(
                                f"""INSERT INTO %s ({template_slots}) VALUES ({template_slots});""",
                                [Path(csv_file_path).stem, *df.columns, *row],
                            ),
                            file=sql_file,
                        )

                    print("", file=sql_file)

                sql_file.flush()  # Force write to disk

        except Exception as e:
            conn.rollback()
            print(f"Database morgify failed: {e}")

        finally:
            cursor.close()
