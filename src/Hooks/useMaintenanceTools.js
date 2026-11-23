import { useEffect, useState } from 'react';
import {
  checkUpdates,
  downloadBackup,
  getApplicationInfo,
  restoreBackup,
} from '../Api/MaintenanceApi';

const LAST_BACKUP_KEY = 'xpeditze.last-backup-at.v1';

export function useMaintenanceTools() {
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [maintenanceError, setMaintenanceError] = useState('');
  const [busy, setBusy] = useState('');
  const [lastBackupAt, setLastBackupAt] = useState(() =>
    window.localStorage.getItem(LAST_BACKUP_KEY)
  );

  useEffect(() => {
    getApplicationInfo()
      .then(setApplicationInfo)
      .catch((error) => setMaintenanceError(error.message));
  }, []);

  const run = async (name, operation) => {
    setBusy(name);
    setMaintenanceError('');
    try {
      return await operation();
    } catch (error) {
      setMaintenanceError(error.message);
      return null;
    } finally {
      setBusy('');
    }
  };

  return {
    applicationInfo,
    updateStatus,
    maintenanceError,
    busy,
    lastBackupAt,
    createBackup: () =>
      run('backup', async () => {
        await downloadBackup();
        const savedAt = new Date().toISOString();
        window.localStorage.setItem(LAST_BACKUP_KEY, savedAt);
        setLastBackupAt(savedAt);
        return savedAt;
      }),
    restoreBackup: (file) =>
      run('restore', async () => {
        await restoreBackup(file);
        window.location.reload();
      }),
    checkUpdates: () =>
      run('updates', async () => {
        const status = await checkUpdates();
        setUpdateStatus(status);
        return status;
      }),
  };
}
