import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checks the form values and returns an object of error messages.
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = "Enter your full name (at least 2 characters).";
  }
  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }
  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters for your password.";
  }
  if (!values.role) {
    errors.role = "Choose how you will use the platform.";
  }
  return errors;
}

function Register() {
  const [values, setValues] = useState({ name: "", email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault(); // stops the browser from reloading the page
    const newErrors = validate(values);
    setErrors(newErrors);
    setMessage("");
    if (Object.keys(newErrors).length === 0) {
      setMessage("Your details look good. Sending them to the server comes in a later step.");
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up interviews or join one as a candidate."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
        </div>

        <fieldset className="field role-field">
          <legend>I am joining as</legend>
          <div className="role-options">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="interviewer"
                checked={values.role === "interviewer"}
                onChange={handleChange}
              />
              <span>Interviewer</span>
            </label>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="candidate"
                checked={values.role === "candidate"}
                onChange={handleChange}
              />
              <span>Candidate</span>
            </label>
          </div>
          {errors.role && <p className="field-error">{errors.role}</p>}
        </fieldset>

        <button className="btn btn-primary btn-block" type="submit">
          Create account
        </button>

        {message && <p className="form-message" role="status">{message}</p>}
      </form>
    </AuthLayout>
  );
}

export default Register;