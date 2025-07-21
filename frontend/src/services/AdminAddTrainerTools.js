export const Signupdetails = {
  name: "",
  email: "",
  age: "",
  gender: "",
  phone: "",
  dob: "",
  address: "",
  aadhar: "",
};

export const handleSubmitFunc = async (
  e,
  setIsSubmitting,
  adminToken,
  trainerForm,
  setTrainerForm,
  toast
) => {
  e.preventDefault();
  if (Object.values(trainerForm).every(Boolean)) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup-trainer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(trainerForm),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Trainer Added Successfully");
        setTrainerForm({
          name: "",
          email: "",
          age: "",
          gender: "",
          phone: "",
          dob: "",
          address: "",
          aadhar: "",
        });
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  } else {
    const emptyFields = Object.entries(trainerForm)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    const newError = {};
    emptyFields.forEach((field) => {
      newError[field] = true;
    });

    setError(newError);
    const firstErrorField = emptyFields[0];
    if (firstErrorField && fieldRef[firstErrorField]?.current) {
      fieldRef[firstErrorField].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
};
