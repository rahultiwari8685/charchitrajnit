import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://api.bharat19express.com";

const SubscriberRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/api/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Save customer login information
      localStorage.setItem(
        "logininfo",
        JSON.stringify({
          token: data.token,
          customer: data.customer,
        }),
      );

      // Redirect after successful registration
      navigate("/");
    } catch (error) {
      console.error("Customer Registration Error:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Inline Styles
  |--------------------------------------------------------------------------
  */

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 15px",
      boxSizing: "border-box",
      background:
        "linear-gradient(135deg, #fff8e1 0%, #ffffff 50%, #fff3cd 100%)",
    },

    card: {
      width: "100%",
      maxWidth: "520px",
      background: "#ffffff",
      borderRadius: "22px",
      padding: "38px",
      boxSizing: "border-box",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      border: "1px solid #eeeeee",
    },

    logo: {
      width: "58px",
      height: "58px",
      margin: "0 auto 18px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#ffc107",
      color: "#111111",
      fontSize: "27px",
      fontWeight: "800",
    },

    title: {
      textAlign: "center",
      fontSize: "30px",
      lineHeight: "1.2",
      fontWeight: "800",
      margin: "0 0 8px",
      color: "#171717",
    },

    subtitle: {
      textAlign: "center",
      color: "#777777",
      fontSize: "15px",
      margin: "0 0 28px",
    },

    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#333333",
      marginBottom: "8px",
    },

    input: {
      display: "block",
      width: "100%",
      height: "50px",
      boxSizing: "border-box",
      border: "1px solid #dddddd",
      borderRadius: "12px",
      padding: "0 15px",
      fontSize: "15px",
      color: "#222222",
      background: "#ffffff",
      outline: "none",
      marginBottom: "18px",
    },

    error: {
      width: "100%",
      boxSizing: "border-box",
      background: "#fff0f0",
      border: "1px solid #ffcaca",
      color: "#c62828",
      padding: "12px 14px",
      borderRadius: "10px",
      fontSize: "14px",
      marginBottom: "18px",
    },

    button: {
      width: "100%",
      height: "52px",
      border: "none",
      borderRadius: "12px",
      background: "#ffc107",
      color: "#111111",
      fontSize: "16px",
      fontWeight: "700",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },

    loginText: {
      textAlign: "center",
      marginTop: "22px",
      color: "#777777",
      fontSize: "14px",
    },

    loginLink: {
      color: "#111111",
      fontWeight: "700",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>IT</div>

        {/* Heading */}
        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Register to participate in polls and more.
        </p>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label style={styles.label}>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            autoComplete="name"
          />

          {/* Email */}
          <label style={styles.label}>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            autoComplete="email"
          />

          {/* Phone */}
          <label style={styles.label}>Phone Number</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            autoComplete="tel"
          />

          {/* Password */}
          <label style={styles.label}>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <label style={styles.label}>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            autoComplete="new-password"
          />

          {/* Submit */}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.loginLink}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriberRegister;
