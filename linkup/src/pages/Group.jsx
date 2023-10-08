import React, { useEffect, useState } from "react";
import "./CSS/group.css";

const Group = () => {
  const [active, setActive] = useState("groups");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(  `${process.env.REACT_APP_BACKEND_ADDR}/group/groups`); 
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          console.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="group-page-container">
      <div className="group-p-heading">Groups</div>
      <div className="group-p-options">
        <span className={active === "groups" ? "active" : ""} onClick={() => setActive("groups")}>
          Popular Group
        </span>
        <span className={active === "ygp" ? "active" : ""} onClick={() => setActive("ygp")}>
          Your Group
        </span>
        <span className={active === "disc" ? "active" : ""} onClick={() => setActive("disc")}>
          Discovers
        </span>
      </div>
      <div className="group-items-list">
        {groups.map((group, i) => (
          <div className="group-items-list-item" key={i}>
            <div className="group-image">
              <img src={group.image} alt={group.groupName} />
            </div>
            <div className="group-name">
              <span>{group.groupName}</span>
              <span>{group.totalFollowers} Mutual friends</span>
            </div>
            <div className="group-follow-btn">Following</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Group;
