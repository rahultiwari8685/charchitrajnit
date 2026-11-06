import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://api.bharat19express.com";

const SubscriberLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/api/customer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Save customer login
      localStorage.setItem(
        "logininfo",
        JSON.stringify({
          token: data.token,
          customer: data.customer,
        }),
      );

      // Go to homepage
      navigate("/");
    } catch (error) {
      console.error("Customer Login Error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .subscriber-login-page {
          min-height: 80vh;
          padding: 70px 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at top left,
              rgba(0, 0, 0, 0.04),
              transparent 35%
            ),
            #f6f7f9;
        }

        .subscriber-login-overlay {
          width: 100%;
        }

        .subscriber-login-card {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #eeeeee;
          border-radius: 18px;
          padding: 42px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .subscriber-login-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .subscriber-login-logo-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #111111;
          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 25px;

          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .subscriber-login-heading {
          text-align: center;
          margin-bottom: 30px;
        }

        .subscriber-login-heading h1 {
          margin: 0 0 10px;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: #111111;
        }

        .subscriber-login-heading p {
          margin: 0 auto;
          max-width: 380px;
          color: #777777;
          font-size: 14px;
          line-height: 1.7;
        }

        .subscriber-login-error {
          display: flex;
          align-items: center;
          gap: 9px;

          margin-bottom: 22px;
          padding: 12px 14px;

          border-radius: 8px;
          background: #fff1f1;
          border: 1px solid #ffd5d5;

          color: #d62828;
          font-size: 13px;
        }

        .subscriber-form-group {
          margin-bottom: 20px;
        }

        .subscriber-form-group label {
          display: block;
          margin-bottom: 8px;

          color: #222222;
          font-size: 14px;
          font-weight: 600;
        }

        .subscriber-input-wrapper {
          position: relative;
        }

        .subscriber-input-wrapper > i {
          position: absolute;
          left: 15px;
          top: 50%;

          transform: translateY(-50%);

          color: #999999;
          font-size: 14px;
          pointer-events: none;
        }

        .subscriber-input-wrapper input {
          width: 100%;
          height: 52px;

          padding: 0 15px 0 44px;

          border: 1px solid #dddddd;
          border-radius: 8px;

          outline: none;

          background: #ffffff;
          color: #222222;

          font-size: 14px;

          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .subscriber-input-wrapper input::placeholder {
          color: #aaaaaa;
        }

        .subscriber-input-wrapper input:focus {
          border-color: #111111;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }

        .subscriber-input-wrapper input:disabled {
          background: #f7f7f7;
        }

        .subscriber-login-button {
          width: 100%;
          height: 52px;

          margin-top: 5px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          border: none;
          border-radius: 8px;

          background: #111111;
          color: #ffffff;

          font-size: 15px;
          font-weight: 600;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .subscriber-login-button:hover {
          background: #292929;
          transform: translateY(-1px);
        }

        .subscriber-login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .subscriber-spinner {
          width: 17px;
          height: 17px;

          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;

          border-radius: 50%;

          animation: subscriber-spin 0.7s linear infinite;
        }

        @keyframes subscriber-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .subscriber-login-footer {
          margin-top: 25px;
          padding-top: 22px;

          border-top: 1px solid #eeeeee;

          text-align: center;

          color: #777777;
          font-size: 14px;
        }

        .subscriber-login-footer a {
          margin-left: 5px;

          color: #111111;
          font-weight: 600;
          text-decoration: none;
        }

        .subscriber-login-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .subscriber-login-page {
            min-height: 75vh;
            padding: 35px 15px;
          }

          .subscriber-login-card {
            padding: 30px 22px;
            border-radius: 14px;
          }

          .subscriber-login-heading h1 {
            font-size: 26px;
          }

          .subscriber-login-logo-circle {
            width: 60px;
            height: 60px;
            font-size: 22px;
          }
        }
      `}</style>

      <div className="subscriber-login-page">
        <div className="subscriber-login-overlay">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8 col-sm-11">
                <div className="subscriber-login-card">
                  {/* Icon */}
                  <div className="subscriber-login-logo">
                    <div className="subscriber-login-logo-circle">
                      <i className="fa fa-user" />
                    </div>
                  </div>

                  {/* Heading */}
                  <div className="subscriber-login-heading">
                    <h1>Welcome Back</h1>

                    <p>
                      Login to participate in polls and stay connected with the
                      latest news.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="subscriber-login-error">
                      <i className="fa fa-exclamation-circle" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="subscriber-form-group">
                      <label htmlFor="subscriber-email">Email Address</label>

                      <div className="subscriber-input-wrapper">
                        <i className="fa fa-envelope" />

                        <input
                          id="subscriber-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          autoComplete="email"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="subscriber-form-group">
                      <label htmlFor="subscriber-password">Password</label>

                      <div className="subscriber-input-wrapper">
                        <i className="fa fa-lock" />

                        <input
                          id="subscriber-password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Login */}
                    <button
                      type="submit"
                      className="subscriber-login-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="subscriber-spinner" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <i className="fa fa-arrow-right" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Register */}
                  <div className="subscriber-login-footer">
                    <span>Don't have an account?</span>

                    <Link to="/register">Create Account</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriberLogin;
