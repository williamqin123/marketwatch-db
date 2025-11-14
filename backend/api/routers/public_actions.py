from fastapi import APIRouter
import pymysql

from ..dependencies import DB_CONNECT_CONFIG

router = APIRouter()


@router.get("/tickers")
async def tickers_overview(search_query: str | None):
    if search_query is None:
        search_query = ""
    search_query = search_query.strip().lower()
    # returns all tickers if search_query is None, else tickers that contain search_query
    # TODO
    return


@router.get("/ticker/{symbol}")
async def ticker_details_and_price_history(symbol: str):
    # TODO
    return
