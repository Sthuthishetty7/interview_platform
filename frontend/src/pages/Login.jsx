import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }
  if (values.password.length === 0) {
    errors.password = "Enter your password.";
  }
  return errors;
}

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);
    setMessage("");
    if (Object.keys(newErrors).length === 0) {
      setMessage("Your details look good. Logging in through the server comes in a later step.");
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back. Enter your details to continue."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
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
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
        </div>

        <button className="btn btn-primary btn-block" type="submit">
          Log in
        </button>

        {message && <p className="form-message" role="status">{message}</p>}
      </form>
    </AuthLayout>
  );
}

export default Login;