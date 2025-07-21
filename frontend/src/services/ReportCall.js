export const handleUserDownloadFunc = async (adminToken) => {
  try {
    const response = await fetch("http://localhost:5000/api/download-users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      const errJson = await response.json();
      alert(errJson.message || "Download failed");
      return;
    }

    const data = await response.blob();
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Users.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("Download failed", error);
  }
};

export const handleTrainerDownloadFunc = async (adminToken) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/download-trainers",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    if (!response.ok) {
      const errJson = await response.json();
      alert(errJson.message || "Download failed");
      return;
    }

    const data = await response.blob();
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Trainers.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("Download failed", error);
  }
};
