import json
from datetime import datetime, timedelta

import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"]
)


ELEXON_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"
BID_DEADLINE = "2026-01-T11:00:00Z"


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
    delivery_window: dict[str, DeliveryWindow]
    metrics: dict[str, Metrics]
    series: list[dict[str, Series]]


@app.get("/")
def main(date: str):
    params = {
        "publishDateTimeFrom": "2026-01-25T23:30:00Z",
        "publishDateTimeTo": "2026-01-26T23:00:00Z",
        "fuelType": "WIND",
    }
    headers = {"Accept": "application/json"}
    # resp = requests.get(f"{ELEXON_URL}/FUELHH/stream", params=params, headers=headers, stream=True)
    # data = resp.json()
    # for i in data:
    #     print(i)
    with requests.get(
        f"{ELEXON_URL}/FUELHH/stream", params=params, headers=headers, stream=True
    ) as res:
        for i in res.iter_lines():
            data = json.loads(i)

        for i in data:
            print(i)

    dt = datetime.fromisoformat(date)
    prev_date = dt - timedelta(1)
    prev_date.isoformat().replace("+00:00", "Z")
    with requests.get(
        f"{ELEXON_URL}/WINDFOR/stream", params=params, headers=headers, stream=True
    ) as res:
        for i in res.iter_lines():
            data = json.loads(i)

    return {"msg": "Hello from server!"}


@app.get("/health")
def health():
    return {"status": "ok"}
