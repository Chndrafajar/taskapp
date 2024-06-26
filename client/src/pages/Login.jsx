import React from 'react';

export default function Login() {
  const loginWithGoogle = () => {
    window.open('https://taskapp-api.vercel.app/auth/google/callback', '_self');
  };

  return (
    <div className="auth">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <h4>Login Pages</h4>
              <button className="btn-login-google" onClick={loginWithGoogle}>
                <img src="/images/google.svg" alt="" />
                <span>Sign In With Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
