from src.config import Config
from src.core.llm_client import LLMClient


def test_parse_json_strips_markdown_fence():
    raw = """```json
    {\"ok\": true, \"value\": 3}
    ```"""
    parsed = LLMClient._parse_json(raw)
    assert parsed["ok"] is True
    assert parsed["value"] == 3


def test_simulated_chat_without_keys_returns_dict():
    client = LLMClient("claude", Config())
    payload = client._simulated("sys", "user")
    assert payload["note"].startswith("simulated response")
