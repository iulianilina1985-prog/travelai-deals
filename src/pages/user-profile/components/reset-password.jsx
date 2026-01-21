import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Reset Password - TravelAI Deals";
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setStatus("An error occurred. Try again.");
    } else {
      setStatus("Password has been changed successfully!");
      setTimeout(() => navigate("/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card border border-border p-8 rounded-lg shadow-sm w-full max-w-md">

        <h2 className="text-2xl font-semibold mb-4">Reset password</h2>

        <p className="text-muted-foreground mb-6">
          Enter the new password for your TravelAI Deals account.
        </p>

        {status && (
          <div className="bg-blue-100 border border-blue-300 text-blue-700 p-3 rounded mb-4 text-sm">
            {status}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">

          <div>
            <label className="block mb-1 text-sm font-medium">New password</label>
            <input
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm password</label>
            <input
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
