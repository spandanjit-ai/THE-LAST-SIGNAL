import { MissionState } from '../engine/missionTypes';
import { EXPECTED_PLAINTEXT_HASH } from '../engine/verification';

export function exportMissionDossier(state: MissionState) {
  const now = new Date().toISOString();
  const started = new Date(state.startedAt).toISOString();
  const unlocked = state.unlockedAt ? new Date(state.unlockedAt).toISOString() : 'UNLOCKED';

  const content = `================================================================================
           CLASSIFIED TRANSMISSION RECOVERY REPORT // THE LAST SIGNAL
================================================================================

DOCUMENT REF      : DOSSIER-${state.missionId}
SECURITY CLEARANCE: LEVEL 5 // COMPARTMENTED ARCHIVE
TRANSMISSION TIME : ${now}
SESSION START     : ${started}
VAULT RESOLUTION  : ${unlocked}

--------------------------------------------------------------------------------
[1] RECOVERED PAYLOAD DECRYPT
--------------------------------------------------------------------------------
ORIGINATING CIPHER : VJG NCUV UKIPCN
ALGORITHM APPLIED  : CAESAR CIPHER / ROT-3
REVERSE OFFSET     : -3 POSITIONS
DECRYPTED MESSAGE  : THE LAST SIGNAL

--------------------------------------------------------------------------------
[2] CRYPTOGRAPHIC SIGNATURE & CERTIFICATION
--------------------------------------------------------------------------------
DIGEST ALGORITHM   : SHA-256 (NIST FIPS 180-4)
DIGEST SIGNATURE   : ${EXPECTED_PLAINTEXT_HASH}
CHECKSUM STATUS    : AUTHENTICATED // MATCH VERIFIED
DOM ANOMALY TOKEN  : SIG-7749-OMEGA
CARRIER FREQUENCY  : 1420.405 MHz (HYDROGEN LINE)
TEMPORAL ALIGNMENT : STABLE RESONANCE WINDOW SATISFIED

--------------------------------------------------------------------------------
[3] OFFICIAL DEBRIEFING LOG
--------------------------------------------------------------------------------
"To all listening exploratory vessels across the quadrant: 
The anomaly has stabilized. The carrier network has held. 
The archive is secured for all future transmissions. 
Transmission sequence complete."

================================================================================
             END OF CLASSIFIED DOSSIER // DEEP SPACE EXPEDITION
================================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `THE_LAST_SIGNAL_DOSSIER_${state.missionId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
