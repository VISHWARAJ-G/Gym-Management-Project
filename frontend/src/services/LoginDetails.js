export const userLoginMethod = async (
  e,
  loginData,
  setIsUserLoggedin,
  navigate,
  setError,
  setMessage,
  setLoading,
  setToken,
  setUser
) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.id,
        password: loginData.password,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setLoading(false);

      const { token, user } = data;

      console.log("User Login Successful");

      localStorage.setItem("Token", token);
      localStorage.setItem("User", JSON.stringify(user));

      setIsUserLoggedin(true);
      setToken(token), setUser(user);

      navigate("/user-dashboard");
    } else {
      setLoading(false);
      console.log("User Login Failed");
      setIsUserLoggedin(false);
      setToken(null), setUser(null);
      setMessage(data.message);
      setError(true);
    }
  } catch (err) {
    setLoading(false);
    console.log("User Login was errored", err);
    setMessage(err);
    setError(true);
  }
};

export const trainerLoginMethod = async (
  e,
  loginData,
  setError,
  setMessage,
  setLoading,
  setIsAdminLoggedIn,
  navigate,
  setAdmin,
  setAdminToken,
  setIsTrainerLoggedIn,
  setTrainer,
  setTrainerToken
) => {
  try {
    e.preventDefault();
    setMessage("");
    setError(false);
    setLoading(true);
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login-trainer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainer_id: loginData.id,
        password: loginData.password,
      }),
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      const trainerRole = data?.admin?.role || data?.trainer?.role;
      setLoading(false);

      if (trainerRole === "trainer") {
        setIsTrainerLoggedIn(true);
        console.log("Trainer Login Successful");
        const { trainer, trainerToken } = data;
        localStorage.setItem("TrainerToken", trainerToken);
        localStorage.setItem("Trainer", JSON.stringify(trainer));
        setTrainer(trainer), setTrainerToken(trainerToken);
        console.log("Trainer Logged in successfully");
        navigate("/trainer-dashboard");
      } else if (trainerRole === "Admin") {
        setIsAdminLoggedIn(true);
        const { admin, adminToken } = data;
        localStorage.setItem("AdminToken", adminToken);
        localStorage.setItem("Admin", JSON.stringify(admin));
        setAdmin(admin), setAdminToken(adminToken);
        console.log("Admin Logged In Successfully");
        navigate("/admin-dashboard");
      }
    } else {
      console.log("Trainer Login Failed");
      setMessage(data.message);
      setError(true);
      setIsAdminLoggedIn(false);
      setAdmin(null), setAdminToken(null);
    }
  } catch (err) {
    setLoading(false);
    console.log("Trainer Login was errored");
    setMessage(err.message || "Network error");
    setError(true);
  }
};
