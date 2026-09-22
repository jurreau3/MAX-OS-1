import { describe, expect, it } from 'vitest';
import { normalizeSIMState } from '../../src/maxos/state/models/state';
import { SIMLane } from '../../src/maxos/sim/lane';
import { Substrate } from '../../src/maxos/state/substrate';

describe('SIM introspection behavior', () => {
  it('normalizes legacy SIM state into the full behavior shape', () => {
    const state = normalizeSIMState({ memory: {} });

    expect(state.mode).toBe('idle');
    expect(state.lastOp).toBeNull();
    expect(state.global).toEqual({});
    expect(state.status).toBe('not_connected');
  });

  it('returns a full behavior snapshot', async () => {
    const substrate = new Substrate();
    substrate.readSIM = async () => normalizeSIMState({
      mode: 'running',
      lastOp: 'calc',
      global: { x: 1 },
      status: 'connected',
    });

    const result = await new SIMLane(substrate).handleIntrospectionBehavior();

    expect(result.mode).toBe('running');
    expect(result.lastOp).toBe('calc');
    expect(result.global).toEqual({ x: 1 });
    expect(result.status).toBe('connected');
  });
});
