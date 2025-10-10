from __future__ import annotations

from fastapi.testclient import TestClient

from backend.app.main import create_app
from backend.app.services.store import store


client = TestClient(create_app())


def setup_function() -> None:  # type: ignore[override]
    store.reset()


def _create_project_and_frame() -> tuple[str, str]:
    project_response = client.post('/api/projects', json={'name': 'Storyboard Demo'})
    project_id = project_response.json()['id']

    frame_payload = {
        'project_id': project_id,
        'frame_number': 1,
        'prompt': 'Opening shot description',
        'metadata': {},
        'selected_characters': [],
        'selected_locations': [],
        'selected_props': [],
    }
    frame_response = client.post(f'/api/projects/{project_id}/frames', json=frame_payload)
    frame_id = frame_response.json()['id']
    return project_id, frame_id


def test_confirm_generation_marks_frame_and_generation():
    _, frame_id = _create_project_and_frame()

    generation_payload = {
        'mode': 'turbo',
        'iterations': 1,
        'style_strength': 75,
        'prompt_weight': 80,
        'aspect_ratio': '16:9',
    }
    generation_response = client.post(f'/api/frames/{frame_id}/generate', json=generation_payload)
    generation_id = generation_response.json()[0]['id']

    confirm_response = client.post(f'/api/generations/{generation_id}/confirm')
    assert confirm_response.status_code == 200
    confirmed_generation = confirm_response.json()
    assert confirmed_generation['is_confirmed'] is True

    frame_response = client.get(f'/api/frames/{frame_id}')
    frame = frame_response.json()
    assert frame['confirmed_generation_id'] == generation_id
    assert frame['confirmed_image_url'] == confirmed_generation['image_url']
    assert frame['confirmed_type'] == confirmed_generation['type']


def test_confirm_generation_requires_existing_id():
    response = client.post('/api/generations/00000000-0000-0000-0000-000000000123/confirm')
    assert response.status_code == 404


def test_project_default_prompts_are_structured():
    project_id, _ = _create_project_and_frame()
    response = client.get(f'/api/projects/{project_id}')
    assert response.status_code == 200
    project = response.json()

    defaults = project['default_prompts']
    assert set(defaults.keys()) == {'black_and_white', 'color'}
    assert defaults['black_and_white']['base']
    assert defaults['black_and_white']['user_customization'] == ''
    assert defaults['color']['base']
