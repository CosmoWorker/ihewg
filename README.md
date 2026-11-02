# Energy Forecast Visualization
A energy forecast platform for visualizing data for renewable energy forecasts.

## Tools Utilised
* Backend: FastAPI
* Frontend: React
* External API: Elexon API
* Docker

## Setup
### Prerequisites
* Docker 
* Node.js (v24+) and pnpm
### Environment Variables
Copy the example files before running locally:
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

| File | Variable | Default | Description |
|------|----------|---------|-------------|
| `client/.env` | `VITE_API_URL` | `http://localhost:8000` | Backend URL (baked into Vite bundle at build time) |
| `server/.env` | `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins allowed to call the API |


Start all the services using docker compose by running the following command at root:
```bash
docker compose up --build
```
Access the application at:
* Client: `http://localhost:5173`
* Server: `http://localhost:8000`

## Architecture
```mermaid
flowchart LR
    subgraph Client ["Frontend (React)"]
        UI[Dashboard UI\nAntD + ApexCharts]
    end

    subgraph Server ["Backend (FastAPI)"]
        API[GET /?date_str=YYYY-MM-DD]
        Cache[(In-Memory\nLRU Cache)]
        Engine[Alignment & Metrics Engine\nDeduplication + 30m Interpolation]
    end

    subgraph External ["Elexon BMRS API"]
        FUELHH[FUELHH/stream\nHalf-Hourly Actuals]
        WINDFOR[WINDFOR/stream\nPre-11:00Z Forecasts]
    end

    UI <-->|JSON: Metrics + 48 Blocks| API
    API <--> Cache
    API --> Engine
    Engine -->|30m Offset Window| FUELHH
    Engine -->|<= 11:00 UTC Gate Closure| WINDFOR

    %% Node styles
    classDef frontend fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0c4a6e
    classDef backend fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef cache fill:#fef9c3,stroke:#ca8a04,stroke-width:2px,color:#713f12
    classDef engine fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#4c1d95
    classDef external fill:#ffedd5,stroke:#ea580c,stroke-width:2px,color:#7c2d12

    class UI frontend
    class API backend
    class Cache cache
    class Engine engine
    class FUELHH,WINDFOR external

    %% Subgraph styles
    style Client fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,stroke-dasharray:5 5,color:#0c4a6e
    style Server fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,stroke-dasharray:5 5,color:#14532d
    style External fill:#fff7ed,stroke:#ea580c,stroke-width:2px,stroke-dasharray:5 5,color:#7c2d12

    %% Edge styles (by order of definition)
    linkStyle 0 stroke:#0284c7,stroke-width:2px
    linkStyle 1 stroke:#ca8a04,stroke-width:2px
    linkStyle 2 stroke:#7c3aed,stroke-width:2px
    linkStyle 3 stroke:#ea580c,stroke-width:2px
    linkStyle 4 stroke:#ea580c,stroke-width:2px
```

## Key Project Files
```text
.
├── client/                     # React
│   ├── Dockerfile              # Frontend container configuration
│   └── src/
│   |    ├── types/energy.ts     # TypeScript Response schema
│   |    ├── components/         # KPI Scorecards, Charts, etc.
│   |    └── App.tsx             # Main dashboard & API integration
|   |__README.md                # Other Imp Notes
├── server/                     # FastAPI
│   ├── Dockerfile              # Backend container configuration
│   ├── pyproject.toml          # Python dependencies
│   └── app/
│       ├── main.py             # API routes, LRU caching & Elexon...
│       └── utils/helpers.py    # :30 interpolation & KPI math, etc.
├── compose.yaml                # Multi-container orchestration
└── README.md
```
For frontend Information:  [README.md](client/README.md)


