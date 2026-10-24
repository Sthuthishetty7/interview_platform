// The product name is defined once, so you can rename it in one place.
import { PRODUCT_NAME } from "../utils/constants";

// The sample code shown inside the interview room preview.
const sampleCode = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`;

const features = [
  {
    title: "Video, audio and screen sharing",
    text: "Talk face to face and share a screen straight from the browser. Nothing to install.",
  },
  {
    title: "A shared code editor",
    text: "Both people see the same code as it is typed, so you see how a candidate thinks, not only what they submit.",
  },
  {
    title: "Private interviewer notes",
    text: "Write notes during the call. Only the interviewer can read them.",
  },
  {
    title: "Timer, chat and status",
    text: "Keep time, send quick messages, and mark the interview as started or finished.",
  },
];

// This list is a real sequence, so the steps are numbered.
const steps = [
  { title: "Create an interview", text: "Add a title and a duration. You get a room code." },
  { title: "Share the code", text: "Send the room code to your candidate." },
  { title: "Interview together", text: "Talk, code and take notes in one room." },
  { title: "Finish and review", text: "End the interview and keep your notes and result." },
];

function Logo() {
  return (
    <a className="brand" href="/" aria-label={`${PRODUCT_NAME} home`}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="11" cy="15" r="9" fill="#2850e8" />
        <circle cx="19" cy="15" r="9" fill="#16213e" fillOpacity="0.85" />
      </svg>
      <span>{PRODUCT_NAME}</span>
    </a>
  );
}

function Landing() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className="nav-links" aria-label="Main">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a className="btn btn-ghost" href="/login">Log in</a>
            <a className="btn btn-primary" href="/register">Create account</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <h1>Run the whole technical interview in one room.</h1>
              <p className="hero-lead">
                Video, a shared code editor, chat and private notes, all in the
                browser. Create a room, send the code, and start interviewing.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="/register">Create account</a>
                <a className="btn btn-ghost" href="/login">Log in</a>
              </div>
            </div>

            <div className="workspace" role="img" aria-label="Example of the interview room">
              <div className="ws-bar">
                <span className="chip">In progress</span>
                <span className="ws-meta">
                  <span>Room K7X-92QM</span>
                  <span>32:18</span>
                </span>
              </div>
              <div className="ws-body">
                <pre className="ws-code"><code>{sampleCode}</code></pre>
                <div className="ws-side">
                  <div className="tile">
                    <span className="tile-avatar">A</span>
                    <div>
                      <p className="tile-name">Asha</p>
                      <p className="tile-role">Interviewer</p>
                    </div>
                  </div>
                  <div className="tile">
                    <span className="tile-avatar alt">R</span>
                    <div>
                      <p className="tile-name">Ravi</p>
                      <p className="tile-role">Candidate</p>
                    </div>
                  </div>
                  <div className="chat">
                    <strong>Ravi:</strong> Should I handle duplicates?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-white" id="features">
          <div className="container">
            <h2>Everything an interview needs, in one place.</h2>
            <div className="feature-list">
              {features.map((feature) => (
                <div className="feature-row" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="container">
            <h2>From sign-up to finished interview in four steps.</h2>
            <ol className="steps">
              {steps.map((step) => (
                <li className="step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-white cta-band">
          <div className="container">
            <h2>Set up your first interview today.</h2>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/register">Create account</a>
              <a className="btn btn-ghost" href="/login">Log in</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>{PRODUCT_NAME}</span>
          <span>Built for a hackathon project.</span>
        </div>
      </footer>
    </>
  );
}

export default Landing;