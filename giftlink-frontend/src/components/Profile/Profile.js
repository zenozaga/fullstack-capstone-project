import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const ctx = useAppContext();

  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [changed, setChanged] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fetchUserProfile = useEffect(() => {
    try {
      const name = ctx.state.name;
      const email = ctx.state.email;
      const authtoken = ctx.state.token;

      if (name || authtoken) {
        const storedUserDetails = {
          name: name,
          email: email,
        };

        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  }, [ctx.state.name, ctx.state.email, ctx.state.token]);

  useEffect(() => {
    if (!ctx.isLoggedIn) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [ctx.isLoggedIn, fetchUserProfile, navigate]);

  /////////////////////
  /// Handlers
  /////////////////////

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authtoken = ctx.state.token;
      const email = ctx.state.email;

      if (!authtoken || !email) {
        navigate("/app/login");
        return;
      }

      if (!updatedDetails.name || updatedDetails.name.trim() === "") return;

      const [firstName, lastName] = updatedDetails.name.split(" ");

      const payload = {
        firstName,
        lastName,
      };

      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        //Step 1: Task 1
        method: "PUT",
        //Step 1: Task 2
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authtoken}`,
          Email: email,
        },
        //Step 1: Task 3
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Update the user details in session storage
        //Step 1: Task 4
        ctx.login(updatedDetails.name, updatedDetails.email, authtoken);

        //Step 1: Task 5
        setUserDetails(updatedDetails);
        setEditMode(false);

        // Display success message to the user
        setChanged("Name Changed Successfully!");
        setTimeout(() => {
          setChanged("");
          navigate("/");
        }, 1000);
      } else {
        // Handle error case
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

  /////////////////////
  /// Render
  /////////////////////

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled // Disable the email field
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p>
            {" "}
            <b>Email:</b> {userDetails.email}
          </p>
          <button onClick={handleEdit}>Edit</button>
          <span
            style={{
              color: "green",
              height: ".5cm",
              display: "block",
              fontStyle: "italic",
              fontSize: "12px",
            }}
          >
            {changed}
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
