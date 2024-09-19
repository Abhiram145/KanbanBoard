import React, { useState, useEffect } from "react";
import Ticket from "./Ticket";
import { tickets } from "../data/tickets";

// Import Priority and Column SVG Icons
import HighPriorityIcon from "../assets/icons_FEtask/Img-HighPriority.svg";
import MediumPriorityIcon from "../assets/icons_FEtask/Img-MediumPriority.svg";
import LowPriorityIcon from "../assets/icons_FEtask/Img-LowPriority.svg";
import NoPriorityIcon from "../assets/icons_FEtask/No-priority.svg";

import BacklogIcon from "../assets/icons_FEtask/Backlog.svg";
import TodoIcon from "../assets/icons_FEtask/Todo.svg";
import InProgressIcon from "../assets/icons_FEtask/In_Progress.svg";
import CancelledIcon from "../assets/icons_FEtask/Cancelled.svg";
import DoneIcon from "../assets/icons_FEtask/Done.svg";
// Helper function to get the correct priority icon
const getPriorityIcon = (priority) => {
  switch (priority) {
    case 4:
      return HighPriorityIcon; // Urgent
    case 3:
      return HighPriorityIcon; // High
    case 2:
      return MediumPriorityIcon; // Medium
    case 1:
      return LowPriorityIcon; // Low
    case 0:
    default:
      return NoPriorityIcon; // No priority
  }
};

const KanbanBoard = () => {
  const [view, setView] = useState("status"); // Grouping: status, user, priority
  const [sortOption, setSortOption] = useState("priority"); // Sorting: priority or title

  // Retrieve user's view state from localStorage when the component mounts
  useEffect(() => {
    const savedView = localStorage.getItem("view");
    const savedSort = localStorage.getItem("sortOption");
    if (savedView) setView(savedView);
    if (savedSort) setSortOption(savedSort);
  }, []);

  // Save user's view state to localStorage when the view or sort option changes
  useEffect(() => {
    localStorage.setItem("view", view);
    localStorage.setItem("sortOption", sortOption);
  }, [view, sortOption]);

  // Function to group tickets based on selected view (status, user, or priority)
  const getGroupedTickets = () => {
    let grouped = {};

    if (view === "status") {
      grouped = tickets.reduce((acc, ticket) => {
        (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
        return acc;
      }, {});
    }
    
    // Group by User
    if (view === "user") {
      grouped = tickets.reduce((acc, ticket) => {
        (acc[ticket.user] = acc[ticket.user] || []).push(ticket);
        return acc;
      }, {});
    }

    // Group by Priority
    if (view === "priority") {
      grouped = tickets.reduce((acc, ticket) => {
        const priorityLevel = ["No priority", "Low", "Medium", "High", "Urgent"][ticket.priority];
        (acc[priorityLevel] = acc[priorityLevel] || []).push(ticket);
        return acc;
      }, {});
    }

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (sortOption === "priority") {
          return b.priority - a.priority;
        }
        return a.title.localeCompare(b.title);
      });
    });

    return grouped;
  };

  const groupedTickets = getGroupedTickets();

  // Column names and icons for status grouping
  const statusColumns = [
    { name: "Backlog", icon: BacklogIcon },
    { name: "Todo", icon: TodoIcon },
    { name: "In Progress", icon: InProgressIcon },
    { name: "Done", icon: DoneIcon },
    { name: "Canceled", icon: CancelledIcon },
  ];

  return (
    <div>
      <div className="header">
        {/* Grouping dropdown */}
        <select onChange={(e) => setView(e.target.value)} value={view}>
          <option value="status">Group by Status</option>
          <option value="user">Group by User</option>
          <option value="priority">Group by Priority</option>
        </select>

        {/* Sorting dropdown */}
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Kanban board layout */}
      <div className="kanban-board">
        {/* For group by status, render predefined columns */}
        {view === "status" &&
          statusColumns.map((column) => (
            <div key={column.name} className="kanban-column">
              <h3>
                <img
                  src={column.icon}
                  alt={`${column.name} icon`}
                  style={{ width: "24px", height: "24px", marginRight: "8px" }}
                />
                {column.name}
              </h3>
              {groupedTickets[column.name]?.map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ))}

        {/* For group by user */}
        {view === "user" &&
          Object.keys(groupedTickets).map((user) => (
            <div key={user} className="kanban-column">
              <h3>{user}</h3>
              {groupedTickets[user]?.map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ))}

        {/* For group by priority */}
        {view === "priority" &&
          Object.keys(groupedTickets).map((priority) => (
            <div key={priority} className="kanban-column">
              <h3>
                <img
                  src={getPriorityIcon(["No priority", "Low", "Medium", "High", "Urgent"].indexOf(priority))}
                  alt={`${priority} Priority Icon`}
                  style={{ width: "24px", height: "24px", marginRight: "8px" }}
                />
                {priority}
              </h3>
              {groupedTickets[priority]?.map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
