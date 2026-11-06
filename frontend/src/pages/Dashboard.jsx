import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { sampleInterviews } from "../data/sampleInterviews";

const statusLabels = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Dashboard() {
  const interviews = [...sampleInterviews].sort(
    (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
  );

  const stats = [
    {
      label: "Total interviews",
      value: interviews.length,
      note: "All interview records",
      icon: "▤",
      color: "blue",
    },
    {
      label: "Scheduled",
      value: interviews.filter((item) => item.status === "scheduled").length,
      note: "Waiting to begin",
      icon: "◷",
      color: "purple",
    },
    {
      label: "In progress",
      value: interviews.filter((item) => item.status === "in_progress").length,
      note: "Currently active",
      icon: "●",
      color: "green",
    },
    {
      label: "Completed",
      value: interviews.filter((item) => item.status === "completed").length,
      note: "Finished interviews",
      icon: "✓",
      color: "orange",
    },
  ];

  return (
    <AppLayout>
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">INTERVIEWLIVE WORKSPACE</p>
          <h1>Welcome back!</h1>
          <p className="dashboard-description">
            Manage your interviews and sharpen your technical skills.
          </p>
        </div>

        <Link to="/mock-test" className="btn btn-primary dashboard-main-action">
          Take a mock test <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="dashboard-stats" aria-label="Interview statistics">
        {stats.map((stat) => (
          <article className="dashboard-stat-card" key={stat.label}>
            <div className={`stat-icon stat-${stat.color}`} aria-hidden="true">
              {stat.icon}
            </div>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-note">{stat.note}</p>
          </article>
        ))}
      </section>
<section className="dashboard-interviews" id="interviews">
        <div className="dashboard-section-heading">
          <div>
            <h2>Your interviews</h2>
            <p>Overview of your interview activity.</p>
          </div>
          <span className="interview-count">
            {interviews.length} total
          </span>
        </div>

        {interviews.length === 0 ? (
          <div className="empty-state">
            <h2>No interviews yet</h2>
            <p>Your interview records will appear here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table dashboard-table">
              <thead>
                <tr>
                  <th scope="col">Interview</th>
                  <th scope="col">Candidate</th>
                  <th scope="col">Date and time</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((item) => (
                  <tr key={item.id}>
                    <td className="interview-title">{item.title}</td>
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
                        <Link
                          className="link-action"
                          to={`/room/${item.roomId}`}
                        >
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
      </section>
    </AppLayout>
  );
}

export default Dashboard;