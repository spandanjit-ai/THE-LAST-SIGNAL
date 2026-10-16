export function initConsoleEasterEgg(missionId: string) {
  if (typeof window === 'undefined') return;

  const banner = `
  ████████╗██╗  ██╗███████╗    ██╗      █████╗ ███████╗████████╗
  ╚══██╔══╝██║  ██║██╔════╝    ██║     ██╔══██╗██╔════╝╚══██╔══╝
     ██║   ███████║█████╗      ██║     ███████║███████╗   ██║   
     ██║   ██╔══██║██╔══╝      ██║     ██╔══██║╚════██║   ██║   
     ██║   ██║  ██║███████╗    ███████╗██║  ██║███████║   ██║   
     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   
                                                                
  ███████╗██╗ ██████╗ ███╗   ██╗ █████╗ ██╗                     
  ██╔════╝██║██╔════╝ ████╗  ██║██╔══██╗██║                     
  ███████╗██║██║  ███╗██╔██╗ ██║███████║██║                     
  ╚════██║██║██║   ██║██║╚██╗██║██╔══██║██║                     
  ███████║██║╚██████╔╝██║ ╚████║██║  ██║███████╗                
  ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝                
  `;

  console.log(
    `%c${banner}`,
    'color: #00f0ff; font-weight: bold; background: #020408; font-family: monospace;'
  );

  console.log(
    `%c[SYSTEM TELEMETRY ACTIVE] %cMISSION SESSION: %c${missionId}`,
    'color: #00f0ff; font-weight: bold; background: #0b1636; padding: 3px 6px; border-radius: 3px;',
    'color: #94a3b8;',
    'color: #38bdf8; font-weight: bold;'
  );

  console.log(
    `%c[DOM ANOMALY DIRECTIVE] %cTarget node #transmission-anomaly-node contains [data-signal-anomaly="SIG-7749-OMEGA"]. Inspect and verify.`,
    'color: #f59e0b; font-weight: bold; background: #451a03; padding: 3px 6px; border-radius: 3px;',
    'color: #cbd5e1;'
  );

  console.log(
    `%c[JUDGE SHORTCUT] %cPress %cCtrl+Shift+D%c or %cCmd+Shift+D%c anywhere to toggle Judge Quick-Solve mode.`,
    'color: #a855f7; font-weight: bold; background: #2e1065; padding: 3px 6px; border-radius: 3px;',
    'color: #cbd5e1;',
    'color: #00f0ff; font-weight: bold;',
    'color: #cbd5e1;',
    'color: #00f0ff; font-weight: bold;',
    'color: #cbd5e1;'
  );
}
