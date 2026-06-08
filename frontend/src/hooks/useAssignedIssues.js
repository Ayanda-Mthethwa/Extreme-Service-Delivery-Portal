import { useState, useEffect } from 'react';
import { getAssignedIssues } from '../services/supervisorService';

const useAssignedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAssignedIssues()
      .then(res => setIssues(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { issues, setIssues, loading, error };
};

export default useAssignedIssues;
