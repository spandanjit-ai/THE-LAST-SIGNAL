export interface LockNodeDefinition {
  id: string;
  code: string;
  label: string;
  sublabel: string;
  role: string;
  color: string;
  glowColor: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export const CIPHER_LOCK_NODES: LockNodeDefinition[] = [
  {
    id: 'alpha',
    code: 'α-CARRIER',
    label: '1420.405 MHz',
    sublabel: 'Hydrogen Line Oscillator',
    role: 'Carrier Base Frequency',
    color: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.6)',
    x: 18,
    y: 35,
  },
  {
    id: 'beta',
    code: 'β-MODULATOR',
    label: 'ROT-2 SHIFT',
    sublabel: 'Caesar Modular Offset',
    role: 'Cryptographic Rotation',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    x: 50,
    y: 18,
  },
  {
    id: 'gamma',
    code: 'γ-SIGNATURE',
    label: 'SIG-7749-OMEGA',
    sublabel: 'DOM Metadata Anomaly',
    role: 'Packet Authorization Token',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    x: 82,
    y: 35,
  },
  {
    id: 'delta',
    code: 'δ-TEMPORAL',
    label: 'STABLE WINDOW',
    sublabel: 'Harmonic Convergence Gate',
    role: 'Temporal Phase Alignment',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    x: 70,
    y: 82,
  },
  {
    id: 'omega',
    code: 'Ω-ARCHIVE',
    label: 'OMEGA VAULT',
    sublabel: 'SHA-256 Digest Core',
    role: 'Final Verification Terminal',
    color: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.7)',
    x: 30,
    y: 82,
  },
];

export const EXPECTED_NODE_SEQUENCE = ['alpha', 'beta', 'gamma', 'delta', 'omega'];

export interface SequenceValidationResult {
  isValidPrefix: boolean;
  isComplete: boolean;
  expectedNextNode?: string;
  error?: string;
}

/**
 * Validates a progressive node-wire connection sequence.
 * Enforces exact cryptographic order: alpha -> beta -> gamma -> delta -> omega.
 */
export function validateNodeSequence(sequence: string[]): SequenceValidationResult {
  if (sequence.length === 0) {
    return { isValidPrefix: true, isComplete: false, expectedNextNode: EXPECTED_NODE_SEQUENCE[0] };
  }

  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== EXPECTED_NODE_SEQUENCE[i]) {
      return {
        isValidPrefix: false,
        isComplete: false,
        error: `CIRCUIT_SHORT: Node '${sequence[i]}' disrupts resonant harmonic flow. Expected sequence begins with '${EXPECTED_NODE_SEQUENCE[0]}'.`,
      };
    }
  }

  const isComplete = sequence.length === EXPECTED_NODE_SEQUENCE.length;
  return {
    isValidPrefix: true,
    isComplete,
    expectedNextNode: isComplete ? undefined : EXPECTED_NODE_SEQUENCE[sequence.length],
  };
}
