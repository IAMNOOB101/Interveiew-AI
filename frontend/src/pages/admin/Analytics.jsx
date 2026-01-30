import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/adminApi";

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAnalytics()
      .then(res => setData(res.data.analytics))
      .catch(() => alert("Access denied"));
  }, []);

  return (
    <div>
      <h2>Analytics (Avg Scores by Domain)</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Content</th>
            <th>Clarity</th>
            <th>Confidence</th>
            <th>Overall</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d._id}>
              <td>{d._id}</td>
              <td>{d.avgContent.toFixed(1)}</td>
              <td>{d.avgClarity.toFixed(1)}</td>
              <td>{d.avgConfidence.toFixed(1)}</td>
              <td>{d.avgOverall.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
