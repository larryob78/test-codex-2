from __future__ import annotations


def eu_ai_act_minimum_fields() -> dict[str, str]:
    return {
        "risk_category": "limited",
        "human_oversight": "enabled",
        "logging": "decision_log + cost_report",
    }
