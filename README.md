# Order Service - Phase 1


This is the Phase 1 scaffold for the Orderly project (Order Service).

## Phase 2 - Run docker-compose with Redis, RabbitMQ and Prometheus


1. Start stack:


```bash
docker-compose up -d
```


2. Order service: (if running locally with `npm run dev`) will be reachable at `http://localhost:3000`.


3. Prometheus UI: http://localhost:9090
RabbitMQ management: http://localhost:15672 (guest/guest)
Redis: port 6379


Notes:
- `prometheus.yml` uses `host.docker.internal:3000` as target to scrape the order service metrics when running Prometheus in Docker on macOS/Windows. On Linux you might need to change target to the host IP or run Prometheus outside Docker.