// Sample data shaped like the backend's interview records.
// Once the API is ready, we replace this with a real request.
// Note: candidateName is an assumption. The backend currently returns
// candidateId only, so the API will need to include the name too.
export const sampleInterviews = [
  {
    id: 1,
    title: "Backend Intern",
    candidateName: "Ravi Kumar",
    scheduledAt: "2026-10-27T10:00:00+05:30",
    duration: 45,
    status: "scheduled",
    roomId: "K7X-92QM",
  },
  {
    id: 2,
    title: "Frontend Developer",
    candidateName: "Meera Nair",
    scheduledAt: "2026-10-27T14:30:00+05:30",
    duration: 60,
    status: "scheduled",
    roomId: "P4D-83TN",
  },
  {
    id: 3,
    title: "Data Structures Round",
    candidateName: "Arjun Rao",
    scheduledAt: "2026-10-25T11:00:00+05:30",
    duration: 45,
    status: "in_progress",
    roomId: "M2H-56WB",
  },
  {
    id: 4,
    title: "Full Stack Intern",
    candidateName: "Kiran Bhat",
    scheduledAt: "2026-10-22T16:00:00+05:30",
    duration: 60,
    status: "completed",
    roomId: "T9C-71XE",
  },
];