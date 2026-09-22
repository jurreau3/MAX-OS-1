from typing import Any, Dict, Mapping
from cognitive.sim_introspection import normalize_sim_behavior

# Existing scheduler implementation remains the execution authority. This helper
# preserves the standard kernel envelope while normalizing camelCase worker data.
def wrap_sim_behavior_response(worker_response: Mapping[str, Any]) -> Dict[str, Any]:
    return {
        "ok": True,
        "messageId": worker_response.get("messageId"),
        "type": "introspection",
        "identity": worker_response.get("identity", {}),
        "route": ["introspection", "sim", "behavior"],
        "result": normalize_sim_behavior(worker_response.get("result", {})),
    }
