import { useState, useEffect } from 'react';
import { getDeptIssues } from '../services/issueService';

const useDeptIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDeptIssues()
      .then(res => setIssues(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { issues, setIssues, loading, error };
};

export default useDeptIssues;
