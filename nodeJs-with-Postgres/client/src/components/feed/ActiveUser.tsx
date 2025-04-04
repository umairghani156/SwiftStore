import React from "react";

const ActiveUser = () => {
  const usersData = [
    { id: 1, name: "John Doe", status: "active" },
    { id: 2, name: "Jane Smith", status: "inactive" },
    { id: 3, name: "Alice Johnson", status: "active" },
    { id: 4, name: "Bob Brown", status: "inactive" },
  ];
  return (
    <div className="hidden md:block bg-blue-800 md:p-2">
      <div className="text-blue h-screen  flex flex-col">
        <h1 className=" text-white">Active Users</h1>
        <ul className="">
          {usersData
            .filter((user) => user.status === "active")
            .map((user) => (
              <li key={user.id} className="text-white">
                {user.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ActiveUser;
