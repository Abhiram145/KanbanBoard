import React from "react";
import { FaUserCircle } from "react-icons/fa";  // Icon for user

const Ticket = ({ ticket }) => {
  const priorityColors = ["gray", "blue", "yellow", "orange", "red"]; // Color codes for priority

  return (
    <div className="ticket" style={{ borderLeft: `4px solid ${priorityColors[ticket.priority]}` }}>
      <h4>{ticket.title}</h4>
      <p>Assigned to: {ticket.user}</p>
      <p>Priority: {["No priority", "Low", "Medium", "High", "Urgent"][ticket.priority]}</p>
      <FaUserCircle />
    </div>
  );
};

export default Ticket;
