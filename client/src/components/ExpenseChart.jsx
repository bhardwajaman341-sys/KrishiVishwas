import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Notice we added "{ dataValues }" here! This is the real data coming from the Dashboard.
const ExpenseChart = ({ dataValues }) => {
  const data = {
    // Updated to your exact requested categories
    labels: ['Seeds', 'Irrigation', 'Labour', 'Fertilizers', 'Pesticides', 'Equipment'],
    datasets: [
      {
        label: 'Total Farm Expenses (₹)',
        // Here we use the real data, or default to zeros if it's loading
        data: dataValues || [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(76, 175, 80, 0.6)',  // Green (Seeds)
          'rgba(33, 150, 243, 0.6)', // Blue (Irrigation)
          'rgba(244, 67, 54, 0.6)',  // Red (Labour)
          'rgba(255, 152, 0, 0.6)',  // Orange (Fertilizers)
          'rgba(156, 39, 176, 0.6)', // Purple (Pesticides)
          'rgba(96, 125, 139, 0.6)'  // Grey-Blue (Equipment)
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(156, 39, 176, 1)',
          'rgba(96, 125, 139, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Farm Expense Breakdown' },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '20px auto', padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default ExpenseChart;