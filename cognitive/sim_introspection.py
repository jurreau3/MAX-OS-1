"""Normalized SIM behavior fields shared by introspection adapters."""
from typing import Any, Dict, Literal, Mapping, Optional, TypedDict

SimMode = Literal["idle", "planning", "running", "paused", "error"]
SimStatus = Literal["connected", "not_connected"]

class SimBehaviorState(TypedDict):
    mode: SimMode
    last_op: Optional[str]
    last_calc: Optional[str]
    last_map: Optional[str]
    last_pipe: Optional[str]
    last_expand: Optional[str]
    last_build: Optional[str]
    global_state: Dict[str, Any]
    status: SimStatus

def normalize_sim_behavior(raw: Mapping[str, Any] | None) -> SimBehaviorState:
    value = raw or {}
    mode = value.get("mode", "idle")
    if mode not in {"idle", "planning", "running", "paused", "error"}:
        mode = "idle"
    status = value.get("status", "connected")
    if status not in {"connected", "not_connected"}:
        status = "connected"
    global_state = value.get("global", {})
    return {
        "mode": mode,
        "last_op": value.get("lastOp"),
        "last_calc": value.get("lastCalc"),
        "last_map": value.get("lastMap"),
        "last_pipe": value.get("lastPipe"),
        "last_expand": value.get("lastExpand"),
        "last_build": value.get("lastBuild"),
        "global_state": dict(global_state) if isinstance(global_state, Mapping) else {},
        "status": status,
    }
