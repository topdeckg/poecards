import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import type { LogEntry } from '../types';
import './LogPanel.css';

function useFilteredLogs(logs: LogEntry[]) {
  const settings = useGameStore(s => s.logSettings);
  return useMemo(() => {
    return logs.filter((e) => {
      if (e.subtype.includes('success') && !settings.showSuccess) return false;
      if (e.subtype.includes('failure') && !settings.showFailure) return false;
      if (e.subtype.includes('critical') && !settings.showCritical) return false;
      if (e.subtype.includes('auto') && !settings.showAuto) return false;
      if (e.subtype.includes('manual') && !settings.showManual) return false;
      return true;
    });
  }, [logs, settings]);
}

export function LogPanel() {
  const logs = useGameStore(s => s.logs);
  const setSettings = useGameStore(s => s.setLogSettings);
  const clear = useGameStore(s => s.clearLogs);
  const settings = useGameStore(s => s.logSettings);
  const filtered = useFilteredLogs(logs);

  return (
    <div className="panel">
      <h3>Combat Log</h3>
      <div className="log-filters">
        <label><input type="checkbox" checked={settings.showSuccess} onChange={e=>setSettings({showSuccess: e.target.checked})}/> Success</label>
        <label><input type="checkbox" checked={settings.showFailure} onChange={e=>setSettings({showFailure: e.target.checked})}/> Failure</label>
        <label><input type="checkbox" checked={settings.showCritical} onChange={e=>setSettings({showCritical: e.target.checked})}/> Critical</label>
        <label><input type="checkbox" checked={settings.showAuto} onChange={e=>setSettings({showAuto: e.target.checked})}/> Auto</label>
        <label><input type="checkbox" checked={settings.showManual} onChange={e=>setSettings({showManual: e.target.checked})}/> Manual</label>
        <button className="small" onClick={clear}>Clear</button>
      </div>
      <div className="log-list">
        {filtered.length === 0 && <div className="empty">No events yet.</div>}
        {filtered.slice(-100).reverse().map((e) => (
          <div key={e.id} className={`log-row ${e.subtype.join(' ')}`}>
            <span className="ts">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="msg">{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
