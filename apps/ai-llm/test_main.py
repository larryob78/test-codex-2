from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_generate_copy() -> None:
    response = client.post("/generate-copy", json={"product_name": "Widget", "tone": "excited"})
    assert response.status_code == 200
    assert "Widget" in response.json()["copy"]
