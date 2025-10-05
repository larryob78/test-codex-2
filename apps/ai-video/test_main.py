from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_generate_video() -> None:
    response = client.post("/generate-video", json={"concept": "Launch"})
    assert response.status_code == 200
    assert response.json()["concept"] == "Launch"
