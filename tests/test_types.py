from src.core.types import Brief, Concept


def test_brief_defaults_constraints():
    brief = Brief(brand="A", objective="B", audience="C", tone="D")
    assert brief.duration_seconds == 30
    assert brief.constraints == []


def test_concept_route_literal():
    concept = Concept(
        route="safe",
        concept_name="Name",
        tagline="Tag",
        visual_world="World",
        key_scenes=["1", "2", "3"],
        tone="warm",
        why_it_works="Because",
    )
    assert concept.route == "safe"
