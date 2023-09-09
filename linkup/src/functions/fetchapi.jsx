const authUser = async () => {
    console.log("auth checking");
    const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/auth`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
  
    const result = await response.json();
  
    if (response.ok) {
      console.log("user is ", result.user);
      let _result = result.user;
      return _result;
    } else {
      console.log("error while feaching user")
      return false;
    }
  };

  const handleLogout = async () => {
    console.log("logout");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/logout`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("logout successfully");
        // window.location.reload()
        authUser()

      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error while log out", error);
    }
  };
  

  export { authUser , handleLogout };