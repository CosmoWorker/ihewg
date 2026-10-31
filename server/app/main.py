from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(CORSMiddleware, allow_origins=origins)

ELEXON_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets/"


@app.get("/")
def main():
    return {"msg": "Hello from server!"}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    main()
