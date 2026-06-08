import API from './api';

export const getAssignedIssues = () =>
  API.get('/api/supervisor/assigned-issues');

export const updateIssueStatus = (issueId, status) =>
  API.put(`/api/supervisor/update-issue-status/${issueId}`, { status });

export const getSupervisors = () =>
  API.get('/api/supervisor/supervisors');
