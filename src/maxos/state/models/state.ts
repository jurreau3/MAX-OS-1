import type { JsonObject } from '../../types';
import { isJsonObject } from '../../stable';

export type StateModel<T> = {
  key: string;
  version: number;
  value: T;
  appliedTransitions: string[];
};

export type StateTransition<T> = {
  id: string;
  key: string;
  expectedVersion: number;
  next: T;
};

export type UniverseState = JsonObject & {
  started: boolean;
  tick: number;
};

export type SIMMode = 'idle' | 'planning' | 'running' | 'paused' | 'error';
export type SIMStatus = 'connected' | 'not_connected';

export type SIMState = JsonObject & {
  lastEnvelopeId: string | null;
  memory: JsonObject;
  steps: number;
  mode?: SIMMode;
  lastOp?: string | null;
  lastCalc?: string | null;
  lastMap?: string | null;
  lastPipe?: string | null;
  lastExpand?: string | null;
  lastBuild?: string | null;
  global?: JsonObject;
  status?: SIMStatus;
};

export type NormalizedSIMState = SIMState & {
  mode: SIMMode;
  lastOp: string | null;
  lastCalc: string | null;
  lastMap: string | null;
  lastPipe: string | null;
  lastExpand: string | null;
  lastBuild: string | null;
  global: JsonObject;
  status: SIMStatus;
};

export function normalizeSIMState(raw: Partial<SIMState> | null): NormalizedSIMState {
  const base = raw ?? {};
  return {
    ...base,
    lastEnvelopeId: base.lastEnvelopeId ?? null,
    memory: base.memory ?? {},
    steps: typeof base.steps === 'number' && Number.isInteger(base.steps) ? base.steps : 0,
    mode: base.mode ?? 'idle',
    lastOp: base.lastOp ?? null,
    lastCalc: base.lastCalc ?? null,
    lastMap: base.lastMap ?? null,
    lastPipe: base.lastPipe ?? null,
    lastExpand: base.lastExpand ?? null,
    lastBuild: base.lastBuild ?? null,
    global: base.global ?? {},
    status: base.status ?? (raw ? 'connected' : 'not_connected'),
  };
}

export type TECState = JsonObject & { actionCount: number; executions: number; lastEnvelopeId: string };
export type SessionState = JsonObject & { envelopeId: string; identityId: string; lane?: string; reservation?: string; reservationExpiresAt?: number; reservationToken?: string; sessionId: string };

export function isUniverseState(value: unknown): value is UniverseState {
  return isJsonObject(value) && typeof value.started === 'boolean' && typeof value.tick === 'number' && Number.isInteger(value.tick) && value.tick >= 0;
}

export function isSIMState(value: unknown): value is SIMState {
  return isJsonObject(value)
    && (typeof value.lastEnvelopeId === 'string' || value.lastEnvelopeId === null)
    && isJsonObject(value.memory)
    && typeof value.steps === 'number'
    && Number.isInteger(value.steps)
    && value.steps >= 0
    && (value.mode === undefined || ['idle', 'planning', 'running', 'paused', 'error'].includes(value.mode as string))
    && (value.status === undefined || value.status === 'connected' || value.status === 'not_connected');
}

export function isTECState(value: unknown): value is TECState {
  return isJsonObject(value) && typeof value.actionCount === 'number' && Number.isInteger(value.actionCount) && value.actionCount >= 0 && typeof value.executions === 'number' && Number.isInteger(value.executions) && value.executions >= 0 && typeof value.lastEnvelopeId === 'string';
}

export function isSessionState(value: unknown): value is SessionState {
  return isJsonObject(value) && typeof value.envelopeId === 'string' && typeof value.identityId === 'string' && (value.lane === undefined || typeof value.lane === 'string') && (value.reservation === undefined || typeof value.reservation === 'string') && (value.reservationExpiresAt === undefined || (typeof value.reservationExpiresAt === 'number' && Number.isFinite(value.reservationExpiresAt))) && (value.reservationToken === undefined || typeof value.reservationToken === 'string') && typeof value.sessionId === 'string';
}
