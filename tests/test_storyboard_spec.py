import re
from pathlib import Path

SPEC_PATH = Path(__file__).resolve().parents[1] / "docs" / "storyboard-tool-spec.md"


def load_spec_text() -> str:
    return SPEC_PATH.read_text(encoding="utf-8")


def test_spec_file_exists():
    assert SPEC_PATH.exists(), "Storyboard specification document is missing."


def test_required_sections_present():
    text = load_spec_text()
    required_headings = [
        "## Executive Summary",
        "## CORE SYSTEM ARCHITECTURE",
        "## 1. PROJECT MANAGEMENT SYSTEM",
        "## 14. RESPONSIVE DESIGN & MOBILE SUPPORT",
        "## 17. IMPLEMENTATION ROADMAP",
        "## 19. TESTING STRATEGY",
        "## 20. SECURITY & COMPLIANCE",
    ]
    missing = [heading for heading in required_headings if heading not in text]
    assert not missing, f"Missing required sections: {missing}"


def test_code_blocks_are_closed():
    text = load_spec_text()
    code_fence_pattern = re.compile(r"```[\s\S]*?```", re.MULTILINE)
    fences = code_fence_pattern.findall(text)
    fence_count = text.count("```")
    # Each fenced code block should contribute exactly two sets of backticks
    assert fence_count % 2 == 0, "Unbalanced code fences detected in specification."
    assert len(fences) == fence_count // 2, "Some code fences may not be properly closed."


def test_interface_blocks_have_typescript_hint():
    text = load_spec_text()
    interfaces = re.findall(r"```\s*typescript\ninterface ", text)
    assert interfaces, "Expected TypeScript interface code blocks to include language hints."


def test_prompt_builder_example_includes_all_sections():
    text = load_spec_text()
    builder_section = re.search(r"function buildFinalPrompt\([\s\S]+?```", text)
    assert builder_section, "Prompt builder example is missing."
    snippet = builder_section.group(0)
    for keyword in ("Characters:", "Location:", "Props:"):
        assert keyword in snippet, f"Prompt builder example missing '{keyword}' section."
