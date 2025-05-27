import assets from "@/assets/assets";
import { useCallback, useState } from "react";

// Define allowed auth states
type AuthState = "Login" | "Sign Up";

const LoginPage = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isDataSubmitted, setIsDataSubmitted] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<AuthState>("Sign Up");

  const toggleState = useCallback((): void => {
    setCurrentState(
      (currState: AuthState): AuthState =>
        currState === "Login" ? "Sign Up" : "Login"
    );
    setIsDataSubmitted(false);
  }, []);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 sm:gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ---------left----------- */}
      <img
        src={assets.logo_big}
        alt="logo_big"
        className="w-[min(60vw,250px)] sm:w-[min(30vw,250px)]"
      />

      {/* --------right--------- */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              // onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
              onClick={toggleState}
              alt="toggle auth"
            />
          )}
        </h2>

        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        <button className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                onClick={toggleState}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Create an account{" "}
              <span
                onClick={toggleState}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
