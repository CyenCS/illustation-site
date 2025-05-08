import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import '../Design/registry.css';

function Registry() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="registry-page-container">
      <div className="registry-page">
        {showLogin ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}
        <p className="message">
          <button type="button" className="switch" onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Create account now" : "Back to Sign In"}
          </button>
        </p>
      </div>
    </main>
  );
}

export default Registry;

// import React, { useState } from "react";
// import { useAuth } from "../backend.jsx";
// import "../Design/registry.css";

// function Registry() {
//   const { login, signup, alertMessage } = useAuth();
//   const [showLogin, setShowLogin] = useState(true);
//   const [formData, setFormData] = useState({ name: "", password: "" });

//   const toggleForm = () => setShowLogin(!showLogin);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, password } = formData;
//     if (showLogin) {
//       await login(name, password);
//     } else {
//       await signup(name, password);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   return (
//     <main className="registry-page-container">
//       <div className="registry-page">
//         <form onSubmit={handleSubmit} className={showLogin ? "login" : "registration"}>
//           <h2>{showLogin ? "Login" : "Sign Up"}</h2>
//           <div className="inputbox">
//             <input
//               type="text"
//               name="name"
//               placeholder="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="inputbox">
//             <input
//               type="password"
//               name="password"
//               placeholder="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit" className="proceed">{showLogin ? "Login" : "Register"}</button>
//           <p className="message">
//             <button type="button" className="switch" onClick={toggleForm}>
//               {showLogin ? "Create account now" : "Back to Sign In"}
//             </button>
//           </p>
//         </form>
//         {alertMessage && <p id="alert" style={{ color: "red" }}>{alertMessage}</p>}
//       </div>
//     </main>
//   );
// }

// export default Registry;
