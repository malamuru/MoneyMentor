import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { toast } from "react-toastify";

import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUpSignIn = () => {
  const navigate = useNavigate();

  // If true => Login screen, else => Signup screen
  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const createUserDocument = async (user, fallbackName = "") => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const createdAt = new Date();
      await setDoc(userRef, {
        name: user.displayName || fallbackName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        createdAt,
      });
    }
  };

  //  SIGN UP submit handler
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Please enter your full name.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!password) return toast.error("Please enter a password.");
    if (password.length < 6)
      return toast.error("Password should be at least 6 characters.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Optional but nice: set displayName in Firebase auth profile
      await updateProfile(result.user, { displayName: name });

      await createUserDocument(result.user, name);

      toast.success("Account created successfully!");
      resetFields();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN submit handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Please enter your email.");
    if (!password) return toast.error("Please enter your password.");

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      resetFields();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Google auth
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user, result.user.displayName || "");
      toast.success("Signed in with Google!");
      resetFields();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="wrapper">
        <div className="signup-signin-container">
          <h2 style={{ textAlign: "center" }}>
            {isLogin ? (
              <>
                Log In on <span className="blue-text">Financely.</span>
              </>
            ) : (
              <>
                Sign Up on <span className="blue-text">Financely.</span>
              </>
            )}
          </h2>

          {/*  onSubmit depending on screen */}
          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            {!isLogin && (
              <div className="input-wrapper">
                <p>Full Name</p>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="input-wrapper">
              <p>Email</p>
              <input
                type="email"
                placeholder="JohnDoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-wrapper">
              <p>Password</p>
              <input
                type="password"
                placeholder="Example123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {!isLogin && (
              <div className="input-wrapper">
                <p>Confirm Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            )}

            {/*  button is submit, no onClick */}
            <button type="submit" className="btn" disabled={loading}>
              {loading
                ? "Loading..."
                : isLogin
                ? "Log In with Email and Password"
                : "Sign Up with Email and Password"}
            </button>
          </form>

          <p style={{ textAlign: "center", margin: 0 }}>or</p>

          <button
            type="button"
            className="btn btn-blue"
            onClick={handleGoogle}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Log In with Google"
              : "Sign Up with Google"}
          </button>

          <p
            onClick={() => setIsLogin((v) => !v)}
            style={{
              textAlign: "center",
              marginBottom: 0,
              marginTop: "0.5rem",
              cursor: "pointer",
            }}
          >
            {isLogin
              ? "Don't have an account? Click here to Sign Up."
              : "Already have an account? Click here to Log In."}
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpSignIn;
