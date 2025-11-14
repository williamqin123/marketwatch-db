import os
from fastapi import Depends, FastAPI, HTTPException, status

DB_CONNECT_CONFIG = {
    "host": os.environ["DB_HOST"],
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
    "database": os.environ["DB_NAME"],
    "port": int(os.environ["DB_PORT"]),
}

BAD_REQUEST_RESPONSE = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="The data you sent to the API is invalid.",
)
