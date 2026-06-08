import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { getIssueCounts } from '../../../services/issueService';
import '../../../scss/Admin/adminhome.scss';
import person from '../../../assets/person.jpg';
import SignOutModal from '../../../components/SignOutModal';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminHome = () => {
  const [barData, setBarData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Issues per Month',
        data: new Array(12).fill(0),
        backgroundColor: '#60cc4af1',
        borderColor: '#575757',
        borderWidth: 1,
      },
    ],
  });
  const [showSignOut, setShowSignOut] = useState(false);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const response = await getIssueCounts();
        const issueData = response.data;
        const issuesPerMonth = new Array(12).fill(0);
        issueData.forEach(item => {
          // month comes back as "YYYY-MM" — parse the month number
          const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
          issuesPerMonth[monthIndex] += parseInt(item.count, 10);
        });
        setBarData({
          labels: monthNames,
          datasets: [
            {
              label: 'Issues per Month',
              data: issuesPerMonth,
              backgroundColor: '#60cc4af1',
              borderColor: '#575757',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching issue data:', error);
      }
    };
    fetchIssueData();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="admin-home">
      <aside className="menu-aside">
        <img src={person} className="profile-pic" alt="Profile" />
        <h2 className='profile-heading'>{user.name} {user.surname}</h2>
        <ul className="menu-list">
          <li><Link to='/addemployees' className='menu-item'>Create User Accounts</Link></li>
          <li><Link to='/monthly' className="menu-item">Generate Reports</Link></li>
          <li><Link to='/viewaccount' className="menu-item">View Account</Link></li>
          <li>
            <span className="menu-item" style={{ cursor: 'pointer' }} onClick={() => setShowSignOut(true)}>Sign out</span>
          </li>
        </ul>
      </aside>

      <header className="header">Dashboard</header>
      <menu className="content">
        <h2 className="exd-head">Extreme Service Delivery</h2>
        <div className="chart-container">
          <Bar data={barData} options={options} />
        </div>
      </menu>

      <footer className="footer">Copyright© 2024</footer>

      <SignOutModal isOpen={showSignOut} onClose={() => setShowSignOut(false)} />
    </div>
  );
};

export default AdminHome;
