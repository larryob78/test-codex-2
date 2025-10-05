import json
from datetime import datetime, timedelta


def main() -> None:
    now = datetime.utcnow()
    events = []
    for index in range(5):
        events.append(
            {
                "org_id": "demo-org",
                "campaign_id": "cmp-demo",
                "creative_id": "crt-demo",
                "ts": (now - timedelta(minutes=15 * index)).isoformat(),
                "country": "US",
                "device": "mobile",
                "cost": 0.5,
                "revenue": 0.8,
            }
        )
    print(json.dumps(events, indent=2))


if __name__ == "__main__":
    main()
