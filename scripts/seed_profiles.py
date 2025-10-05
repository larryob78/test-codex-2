import json
import random
from typing import Any

SEGMENTS = ["sports", "tech", "travel", "food"]


def build_profile(user_index: int) -> dict[str, Any]:
    return {
        "id": f"user-{user_index}",
        "consent": random.random() > 0.2,
        "segments": random.sample(SEGMENTS, k=2),
    }


def main() -> None:
    payload = [build_profile(i) for i in range(1, 11)]
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
