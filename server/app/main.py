from datetime import date, timedelta
from functools import lru_cache

import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.helpers import get_interpolated_forecast, hourly_forecast_map, metrics_info

app = FastAPI()


origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"]
)


ELEXON_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"


class DeliveryWindow(BaseModel):
    publish_from: str
    publish_to: str
    bid_deadline: str


class Metrics(BaseModel):
    rmse: float
    mse: float
    bias: float


class Series(BaseModel):
    start_time: str
    actual_mw: float
    forecast_mw: float
    error_mw: float


class EnergyResponse(BaseModel):
    delivery_window: DeliveryWindow
    metrics: Metrics
    series: list[Series]


@app.get("/", response_model=EnergyResponse)
@lru_cache(maxsize=15)
def main(date_str: str):
    delivery_date = date.fromisoformat(date_str)
    decision_date = delivery_date - timedelta(1)
    windfor_from_date = delivery_date - timedelta(2)

    bid_deadline = f"{decision_date.isoformat()}T11:00:00Z"
    fuelhh_pub_from = f"{decision_date.isoformat()}T23:30:00Z"
    fuelhh_pub_to = f"{delivery_date.isoformat()}T23:00:00Z"
    windfor_pub_from = f"{windfor_from_date.isoformat()}T00:00:00Z"
    fuelhh_params = {
        "publishDateTimeFrom": fuelhh_pub_from,
        "publishDateTimeTo": fuelhh_pub_to,
        "fuelType": "WIND",
    }
    headers = {"Accept": "application/json"}
    actual_resp = requests.get(
        f"{ELEXON_URL}/FUELHH/stream", params=fuelhh_params, headers=headers
    )
    actual_data = actual_resp.json()

    windfor_params = {
        "publishDateTimeFrom": windfor_pub_from,
        "publishDateTimeTo": bid_deadline,
    }

    forecast_resp = requests.get(
        f"{ELEXON_URL}/WINDFOR/stream", params=windfor_params, headers=headers
    )
    forecast_data = forecast_resp.json()

    hourly_formap = hourly_forecast_map(forecast_data)

    series = []
    for r in actual_data[::-1]:
        st = r["startTime"]
        actual_mw = float(r["generation"])
        forecast_mw = get_interpolated_forecast(st, hourly_formap)
        error_mw = round(forecast_mw - actual_mw, 2)

        series.append(
            {
                "start_time": st,
                "actual_mw": actual_mw,
                "forecast_mw": forecast_mw,
                "error_mw": error_mw,
            }
        )

    return {
        "delivery_window": {
            "publish_from": fuelhh_pub_from,
            "publish_to": fuelhh_pub_to,
            "bid_deadline": bid_deadline,
        },
        "metrics": metrics_info(series),
        "series": series,
    }


@app.get("/health")
def health():
    return {"status": "ok"}
