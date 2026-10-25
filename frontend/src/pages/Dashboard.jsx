import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { sampleInterviews } from "../data/sampleInterviews";

const statusLabels = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
};

// Turns "2026-10-27T10:00:00+05:30" into a readable date and time.
function formatDate(isoString) {
  return new Date(isoString).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Dashboard() {
  const interviews = sampleInterviews;
  const completedCount = interviews.filter((item) => item.status === "completed").length;
  const activeCount = interviews.length - completedCount;

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Your interviews</h1>
        <p className="page-sub">
          {activeCount} upcoming or live, {completedCount} completed
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="empty-state">
          <h2>No interviews yet</h2>
          <p>When you create an interview, it will show up here.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Interview</th>
                <th scope="col">Candidate</th>
                <th scope="col">When</th>
                <th scope="col">Length</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="visually-hidden">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.candidateName}</td>
                  <td>{formatDate(item.scheduledAt)}</td>
                  <td>{item.duration} min</td>
                  <td>
                    <span className={`status status-${item.status}`}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "completed" ? (
                      <span className="muted">Ended</span>
                    ) : (
                      <Link className="link-action" to={`/room/${item.roomId}`}>
                        Open room
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}

export default Dashboard;