"use client";

export const fetchCredits = async () => {
    const jwtToken = localStorage.getItem("mathTutorToken");

    if (!jwtToken) {
      return;
    }

    try {
      const response = await fetch("/api/users/credits", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return;
      }

      sessionStorage.setItem("credits", result.credits);
    } catch (err) {
      console.error(err);
    }
  };
