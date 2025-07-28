import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LoginBarChart = ({ lastLogin }) => {
  const maxMinutes = 10080; // 7 days
  let minutesAgo = maxMinutes;

  if (lastLogin) {
    const now = Date.now();
    const loginTime = new Date(lastLogin).getTime();
    minutesAgo = (now - loginTime) / (1000 * 60);
    if (minutesAgo > maxMinutes) minutesAgo = maxMinutes;
  }

  const value = maxMinutes - minutesAgo;

  const data = {
    labels: [""],
    datasets: [
      {
        label: "Login Recency (min)",
        data: [value],
        backgroundColor: "#28a745",
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: { min: 0, max: maxMinutes, display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: () =>
            lastLogin
              ? `Last login: ${new Date(lastLogin).toLocaleString()}`
              : "Never logged in",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: 120, height: 25 }}>
      <Bar data={data} options={options} />
    </div>
  );
};
export default LoginBarChart;