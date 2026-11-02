import math
from datetime import datetime, timedelta


def hourly_forecast_map(forecast_data: list[dict]) -> dict[str, float]:
    latest_by_start = {}

    for i in forecast_data:
        st = i["startTime"]
        pub = i["publishTime"]

        if st not in latest_by_start or pub > latest_by_start[st]["publishTime"]:
            latest_by_start[st] = i

    return {st: float(j["generation"]) for st, j in latest_by_start.items()}


def get_interpolated_forecast(
    start_time_str: str, hourly_map: dict[str, float]
) -> float:
    if start_time_str in hourly_map:
        return hourly_map[start_time_str]

    dt = datetime.fromisoformat(start_time_str)
    prev_hr = (dt - timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
    next_hr = (dt + timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%SZ")

    prev_val = hourly_map.get(prev_hr, 0.0)
    next_val = hourly_map.get(next_hr, prev_val)

    return round((prev_val + next_val) / 2, 2)


def metrics_info(series: list[dict]) -> dict[str, float]:
    n = len(series)
    if n == 0:
        return {"rmse": 0.0, "mse": 0.0, "bias": 0.0}

    mse = sum(item["error_mw"] ** 2 for item in series) / n
    rmse = math.sqrt(mse)
    bias = sum(item["error_mw"] for item in series) / n

    shortfalls = sorted(max(0, item["error_mw"]) for item in series)
    max_shortfall = shortfalls[-1]

    p95_idx = round(0.95 * (n - 1))
    p95_shortfall = shortfalls[p95_idx]
    
    return {
        "rmse": round(rmse, 2),
        "bias": round(bias, 2),
        "max_shortfall": round(max_shortfall, 2),
        "p95_shortfall": round(p95_shortfall, 2),
    }
