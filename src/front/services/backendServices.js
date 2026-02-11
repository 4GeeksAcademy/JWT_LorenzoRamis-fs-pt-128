export const signup = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return data.error;
  }
  return data;
};

export const login = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/login`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return data.error;
  }
  return data;
};

export const userCheck = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    return false;
  }
  return data;
};
