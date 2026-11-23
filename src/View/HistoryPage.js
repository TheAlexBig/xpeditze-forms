import { useNavigate } from 'react-router-dom';
import HistoryPanel from '../History/HistoryPanel';
import { prepareHistoryDraft } from '../History/HistoryDraftNavigation';
import GlobalPageLayout from './GlobalPageLayout';

export default function HistoryPage({ historyProps, loadDraft }) {
  const navigate = useNavigate();
  const handleLoad = (historyItem) => {
    navigate(prepareHistoryDraft(historyItem, window.localStorage, loadDraft));
  };
  return (
    <GlobalPageLayout>
      <HistoryPanel historyProps={historyProps} onLoad={handleLoad} />
    </GlobalPageLayout>
  );
}
