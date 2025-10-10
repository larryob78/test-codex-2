from __future__ import annotations

from fastapi.testclient import TestClient

from backend.app.main import create_app
from backend.app.services.store import store


client = TestClient(create_app())


def setup_function() -> None:  # type: ignore[override]
    store.reset()


def test_upload_sketch_updates_frame_and_serves_file():
    project_response = client.post('/api/projects', json={'name': 'Storyboard Demo'})
    project_id = project_response.json()['id']

    frame_payload = {
        'id': '00000000-0000-0000-0000-000000000001',
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

    files = {'file': ('sketch.png', b'fake image bytes', 'image/png')}
    upload_response = client.post(f'/api/frames/{frame_id}/sketch', files=files)
    assert upload_response.status_code == 200
    frame = upload_response.json()
    assert frame['sketch']['image_url'].startswith('/uploads/projects/')
    assert frame['sketch']['file_name'] == 'sketch.png'

    asset_response = client.get(frame['sketch']['image_url'])
    assert asset_response.status_code == 200
    assert asset_response.content == b'fake image bytes'


def test_upload_sketch_rejects_invalid_mime_type():
    project_response = client.post('/api/projects', json={'name': 'Storyboard Demo'})
    project_id = project_response.json()['id']

    frame_payload = {
        'id': '00000000-0000-0000-0000-000000000002',
        'project_id': project_id,
        'frame_number': 2,
        'prompt': '',
        'metadata': {},
        'selected_characters': [],
        'selected_locations': [],
        'selected_props': [],
    }

    frame_response = client.post(f'/api/projects/{project_id}/frames', json=frame_payload)
    frame_id = frame_response.json()['id']

    files = {'file': ('malicious.exe', b'invalid', 'application/octet-stream')}
    upload_response = client.post(f'/api/frames/{frame_id}/sketch', files=files)
    assert upload_response.status_code == 400
