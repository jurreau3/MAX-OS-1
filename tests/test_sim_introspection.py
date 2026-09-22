from cognitive.sim_introspection import normalize_sim_behavior


def test_normalize_sim_behavior_defaults():
    result = normalize_sim_behavior({})
    assert result['mode'] == 'idle'
    assert result['status'] == 'connected'


def test_normalize_sim_behavior_maps_fields():
    result = normalize_sim_behavior({
        'mode': 'running',
        'lastOp': 'calc',
        'global': {'x': 1},
        'status': 'connected',
    })

    assert result['mode'] == 'running'
    assert result['last_op'] == 'calc'
    assert result['global_state']['x'] == 1
