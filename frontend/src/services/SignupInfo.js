const validatePassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[A-Za-z0-9!@#$%^&*.,]{8,}$/;
  return regex.test(password);
};

export const patternFunc = (e, setSignupInfo, setErrors, errors) => {
  const value = e.target.value;
  setSignupInfo((prev) => ({ ...prev, [e.target.name]: value }));
  if (!validatePassword(value)) {
    setErrors({ ...errors, password: true });
  } else {
    setErrors({ ...errors, password: false });
  }
};

export const CPassFunc = (e, setSignupInfo, setErrors, errors) => {
  const { name, value } = e.target;
  setSignupInfo((prev) => {
    const updated = { ...prev, [name]: value };
    if (updated.password !== updated.cpassword) {
      setErrors({ ...errors, cpassword: true });
    } else {
      setErrors({ ...errors, cpassword: false });
    }
    return updated;
  });
};

export const handleSubmit = async (
  e,
  signupInfo,
  setErrors,
  errors,
  fieldRef,
  navigate,
  setSignupError,
  setErrorMsg,
  setLoading,
  setSignedUp
) => {
  e.preventDefault();
  setSignupError(false);
  setLoading(true);
  if (Object.values(signupInfo).every(Boolean)) {
    if (validatePassword(signupInfo.password)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/signup-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(signupInfo),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSignupError(false);
          setLoading(false);
          setErrorMsg("");
          setSignedUp(true);
          const expiry = Date.now() + 60 * 1000;
          localStorage.setItem("resendEmailExpiry", expiry.toString());
          navigate("/verify-page");
        } else {
          setSignupError(true);
          setLoading(false);
          setErrorMsg(data.message);
        }
      } catch (error) {
        console.error(`Error:${error}`);
        setLoading(false);
        setSignupError(true);
        setErrorMsg(error);
      }
    } else {
      console.log("Password error");
      setErrors({ ...errors, password: true });
      fieldRef.password?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  } else {
    setLoading(false);
    console.log("Field error");
    const emptyFields = Object.entries(signupInfo)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    const newError = {};
    emptyFields.forEach((field) => {
      newError[field] = true;
    });

    setErrors(newError);
    const firstErrorField = emptyFields[0];
    if (firstErrorField && fieldRef[firstErrorField]?.current) {
      fieldRef[firstErrorField].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
};
