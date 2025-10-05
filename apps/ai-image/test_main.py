from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_generate_image() -> None:
    response = client.post("/generate-image", json={"prompt": "Sample"})
    assert response.status_code == 200
    assert response.json()["provider"] == "sdxl-mock"
