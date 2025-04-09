import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Accordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-container w-full">
      {/* Accordion header */}
      <div
        className="flex items-center text-[.9rem] w-full px-4 h-12 hover:bg-[#E8F9FF] hover:text-slate-900 cursor-pointer"
        onClick={toggleAccordion} // Toggle accordion on click
      >
        <MdManageAccounts />
        <span className="ml-2 text-[.9rem] w-full">Visitor Management</span>
        {!isOpen ? (
          <FaChevronUp className="ml-2 transition-all duration-500" />
        ) : (
          <FaChevronDown className="ml-2" />
        )}
      </div>

      {/* Accordion content */}
      {isOpen && (
        <div className="accordion-content pl-8">
          <ul>
            <li>
              <NavLink
                to="/admin-panel/add-visitor"
                className="flex items-center hover:bg-slate-100 w-full h-8 rounded-tl-xl rounded-bl-xl pl-2  hover:text-black text-[.9rem]"
              >
                Add Visitors
              </NavLink>
            </li>
            <li className=" mt-1 mb-1">
              <NavLink
                to="/admin-panel/all-visitors"
                className="flex items-center hover:bg-slate-100 w-full h-8 rounded-tl-xl rounded-bl-xl pl-2 hover:text-black text-[.9rem]"
              >
                All Visitors
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Accordion;
