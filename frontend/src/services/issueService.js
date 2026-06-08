import API from './api';

export const getMyIssues = () =>
  API.get('/api/issue/my-issues');

export const getAllIssues = (params) =>
  API.get('/api/issue/getAllIssues', { params });

export const getIssueReporter = (residentId) =>
  API.get(`/api/issue/get-issue-reporter/${residentId}`);

export const checkDuplicate = (location, description, issueCategory) =>
  API.post('/api/issue/check-duplicate', { location, description, issueCategory });

export const reportIssue = (formData) =>
  API.post('/api/issue/report-issue', formData);

export const getDeptIssues = () =>
  API.get('/api/issue/dept-issues');

export const getIssueCounts = () =>
  API.get('/api/issue/issue-counts');

export const getAssignedSupervisors = () =>
  API.get('/api/issue/getAssignedSupervisors');

export const getIssuesBySupervisor = (supervisorId) =>
  API.get(`/api/issue/getIssuesAssignedToSupervisors/${supervisorId}`);

export const assignSupervisor = (issueId, supervisorId) =>
  API.post('/api/issue/assign-supervisor', { issueId, supervisorId });
