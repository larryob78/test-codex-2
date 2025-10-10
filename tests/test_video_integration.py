import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient

from backend.app.main import create_app
from backend.app.services.store import store


client = TestClient(create_app())


def setup_function() -> None:  # type: ignore[override]
    store.reset()


def test_video_providers_exposed():
    response = client.get('/api/ai/video/providers')
    assert response.status_code == 200
    providers = {provider['id'] for provider in response.json()}
    assert {'openai-sora', 'google-veo3', 'kling-2-5'} <= providers


def test_video_generation_lifecycle():
    project_response = client.post('/api/projects', json={'name': 'Test Cinematic'})
    assert project_response.status_code == 201
    project_id = project_response.json()['id']

    generation_response = client.post(
        f'/api/projects/{project_id}/video/generations',
        json={
            'provider_id': 'openai-sora',
            'prompt': 'A sweeping drone shot over neon cityscapes',
            'aspect_ratio': '21:9',
        },
    )
    assert generation_response.status_code == 202
    job = generation_response.json()
    assert job['status'] == 'rendering'

    status_response = client.get(f"/api/video/generations/{job['id']}")
    assert status_response.status_code == 200
    status_payload = status_response.json()
    assert status_payload['status'] == 'complete'
    assert status_payload['preview_url']

    list_response = client.get(f'/api/projects/{project_id}/video/generations')
    assert list_response.status_code == 200
    job_ids = [item['id'] for item in list_response.json()]
    assert job['id'] in job_ids
