import { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import '../../styles/admin.css';
import AdminPanel from './AdminPanel';

/** Floating status pill (when the panel is closed) + the editor drawer. */
export default function AdminRoot() {
  const { panelOpen, setPanelOpen, dirty, save, logout } = useSite();
  const [msg, setMsg] = useState('');

  const quickSave = async () => {
    setMsg('Saving…');
    try {
      await save();
      setMsg('Published ✓');
    } catch (err) {
      setMsg(err.message);
    }
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <>
      {!panelOpen && (
        <div className="adm-pill">
          <span className={dirty ? 'dot warn' : 'dot'} />
          <b>Admin</b>
          <span className="adm-st">{msg || (dirty ? 'Unsaved changes' : 'All saved')}</span>
          <button type="button" onClick={() => setPanelOpen(true)}>
            Edit
          </button>
          {dirty && (
            <button type="button" className="pri" onClick={quickSave}>
              Publish
            </button>
          )}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {panelOpen && <AdminPanel />}
    </>
  );
}
