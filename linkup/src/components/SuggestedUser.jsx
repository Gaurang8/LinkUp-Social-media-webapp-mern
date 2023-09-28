import React, { useState, useEffect } from "react";
import "./css/suggesteduser.css";
import { handleFollow } from "../functions/fetchapi";

const SuggestedUser = () => {
  // /suggestedusers
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDR}/suggestedusers`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setSuggestedUsers(data.suggestedUsers);
            console.log("suggested user", data.suggestedUsers);
          });
      } catch (error) {
        console.log("Error while getting suggested users", error);
      }
    };
    getSuggestedUsers();
  }, []);
  return (
    <div className="suggested-user">
      <div className="suggested-u-header">
        <h2>Suggested User</h2>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat,
          numquam quas!
        </p>
      </div>
      <div className="suggested-u-body">
        {suggestedUsers && !viewAll
          ? suggestedUsers.slice(0, 5).map((user) => {
              return (
                <div className="suggested-u-body-items">
                  <div className="suggested-u-body-items-img">
                    <img
                      src="https://picsum.photos/40/40"
                      alt="suggested-user-img"
                    />
                  </div>
                  <div className="suggested-u-body-items-name">
                    <h3>{user.name}</h3>
                    <p>user name</p>
                  </div>
                  <div className="suggested-u-body-items-btn">
                    <button
                      onClick={() => {
                        handleFollow(user._id);
                      }}
                    >
                      follow
                    </button>
                  </div>
                </div>
              );
            })
          : suggestedUsers.map((user) => {
              return (
                <div className="suggested-u-body-items">
                  <div className="suggested-u-body-items-img">
                    <img
                      src="https://picsum.photos/40/40"
                      alt="suggested-user-img"
                    />
                  </div>
                  <div className="suggested-u-body-items-name">
                    <h3>{user.name}</h3>
                    <p>user name</p>
                  </div>
                  <div className="suggested-u-body-items-btn">
                    <button
                      onClick={() => {
                        handleFollow(user._id);
                      }}
                    >
                      follow
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
      <div className="suggested-u-footer">
        <p>{suggestedUsers.length} suggestion</p>
        {
            viewAll ? <button onClick={() => setViewAll(false)}>view less</button> : <button onClick={() => setViewAll(true)}>view all</button>
        }
      </div>
    </div>
  );
};

export default SuggestedUser;
