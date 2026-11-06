
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { apiFetch } from "../lib/api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your full name (at least 2 characters).";
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (!["interviewer", "candidate"].includes(values.role)) {
    errors.role = "Choose how you will use the platform.";
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);
    setMessage("");

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const registrationResponse = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          role: values.role,
        }),
      });

      const registrationData = await registrationResponse.json();

      if (!registrationResponse.ok) {
        throw new Error(
          registrationData.error || registrationData.message || "Registration failed."
        );
      }

      // Registration does not return a token, so log in next.
      const loginResponse = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
  throw new Error(
    loginData.error ||
    loginData.message ||
    "Account created, but automatic login failed. Please log in manually."
  );
}

if (
  !loginData.token ||
  !loginData.user?.id ||
  !["interviewer", "candidate"].includes(loginData.user.role)
) {
  throw new Error(
    "Account created, but the login response was invalid. Please log in manually."
  );
}
      sessionStorage.setItem("token", loginData.token);
      sessionStorage.setItem("user", JSON.stringify(loginData.user));

      navigate(
        loginData.user.role === "interviewer"
          ? "/interviewer/dashboard"
          : "/candidate/dashboard",
        { replace: true }
      );
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
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
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
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
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
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
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
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

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {message && (
          <p className="form-message" role="alert">
            {message}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

export default Register;
