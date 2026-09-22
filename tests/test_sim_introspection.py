from cognitive.sim_introspection import normalize_sim_behavior
from kernel.dispatcher import dispatch_kernel_message


def test_introspection_route_is_registered():
    from routing.table import INTROSPECTION_ROUTES

    assert INTROSPECTION_ROUTES[("introspection", "sim", "behavior")] == "introspection.sim.behavior"


def test_dispatch_kernel_message_wraps_behavior():
    response = dispatch_kernel_message(
        {
            "messageId": "message-1",
            "route": ["introspection", "sim", "behavior"],
            "identity": {"id": "system"},
        },
        lambda _message: {"result": {"mode": "running", "lastOp": "calc", "global": {"x": 1}}},
    )

    assert response == {
        "ok": True,
        "messageId": "message-1",
        "type": "introspection",
        "identity": {"id": "system"},
        "route": ["introspection", "sim", "behavior"],
        "result": {
            "mode": "running",
            "last_op": "calc",
            "last_calc": None,
            "last_map": None,
            "last_pipe": None,
            "last_expand": None,
            "last_build": None,
            "global_state": {"x": 1},
            "status": "connected",
        },
    }
