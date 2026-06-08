require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const issueRoutes = require('./src/routes/issueRoutes');
const supervisorRoutes = require('./src/routes/supervisorRoutes');
const updatesRoutes = require('./src/routes/updatesRoutes');
const announcementsRoutes = require('./src/routes/announcementsRoutes');
const notificationsRoutes = require('./src/routes/notificationsRoutes');
const reportsRoutes = require('./src/routes/reportsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
