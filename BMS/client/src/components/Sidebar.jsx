import React, { useState } from "react";
import { AiOutlineIssuesClose } from "react-icons/ai";
import {
  MdManageAccounts,
  MdDashboardCustomize,
  MdEmergency,
} from "react-icons/md";
import { FaHospitalUser, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import AddUsers from "./admin/AddUsers";
import AllUsers from "./admin/AllUsers";
import Accordion from "../chunksComponents/Accordion";

const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
  const [openAccordion, setOpenAccordion] = useState(false);

  const toggleAccordion = () => {
    setOpenAccordion((prevState) => !prevState);
  };

  return (
    <div>
      <div
        className={`flex flex-col w-[200px] border-r-[1px] border-[#1A415A] h-[100vh] text-white transition-transform fixed ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-10`}
      >
        <div className="flex flex-row justify-evenly items-center h-12 bg-[#E8F9FF] pt-8 pb-8">
          <img src="/assets/images/bms-logo.png" alt="bms" className="h-24" />
          <button
            onClick={toggleSidebar}
            className="md:hidden bg-[#E8F9FF] text-[#1A415A] p-2 rounded-md text-2xl"
          >
            ☰
          </button>
        </div>
        <div className="flex flex-col items-center h-full overflow-y-auto">
          <NavLink
            to="/admin-panel/dashboard"
            className="flex items-center mt-10 text-[.9rem] pl-4 w-full h-12 hover:bg-[#E8F9FF] hover:text-slate-900 pr-4 flex-nowrap"
            activeClassName="bg-[#E8F9FF] text-slate-900"
          >
            <MdDashboardCustomize />
            <span className="ml-2 text-[.9rem]">Dashboard</span>
          </NavLink>

          {/* Visitor Management */}
          <Accordion/>

          <NavLink
            to="/admin-panel/issue-management"
            className="flex items-center text-[.9rem] pl-4 w-full h-12 hover:bg-[#E8F9FF] hover:text-slate-900 pr-4"
            activeClassName="bg-[#E8F9FF] text-slate-900"
          >
            <AiOutlineIssuesClose />
            <span className="ml-2 text-[.9rem]">Issue Management</span>
          </NavLink>

          <NavLink
            to="/admin-panel/real-time-analytics"
            className="flex items-center text-[.9rem] pl-4 w-full h-12 hover:bg-[#E8F9FF] hover:text-slate-900 pr-4"
            activeClassName="bg-[#E8F9FF] text-slate-900"
          >
            <IoMdAnalytics />
            <span className="ml-2 text-[.9rem]">Real-Time Analytics</span>
          </NavLink>

          <div className="w-full">
            <button
              onClick={toggleAccordion}
              className="flex items-center w-full pl-4 pr-4 h-12 hover:bg-[#E8F9FF] hover:text-slate-900"
            >
              <FaHospitalUser />
              <span className="ml-2 text-[.9rem]">User Management</span>
              {!openAccordion ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>

            {openAccordion && (
              <div className="pl-8">
                <Link
                  to="/admin-panel/add-users"
                  className="flex items-center w-full h-12  hover:text-slate-300 text-[.9rem]"
                  element={<AddUsers />}
                >
                  Add Users
                </Link>
                <Link
                  to="/admin-panel/all-users"
                  element={<AllUsers />}
                  className="flex items-center w-full h-12  hover:text-slate-300 text-[.9rem]"
                >
                  All Users
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/admin-panel/emergency-alerts"
            className="flex items-center text-[.9rem] pl-4 w-full h-12 hover:bg-[#E8F9FF] hover:text-slate-900 pr-4"
            activeClassName="bg-[#E8F9FF] text-slate-900"
          >
            <MdEmergency />
            <span className="ml-2 text-[.9rem]">Emergency Alerts</span>
          </NavLink>

          <NavLink
            to="/admin-panel/settings"
            className="flex items-center text-[.9rem] pl-4 w-full h-12 hover:bg-[#E8F9FF] hover:text-slate-900 pr-4"
            activeClassName="bg-[#E8F9FF] text-slate-900"
          >
            <CiSettings />
            <span className="ml-2 text-[.9rem]">Settings</span>
          </NavLink>
        </div>
      </div>

      <div className="md:ml-[200px]"></div>
    </div>
  );
};

export default Sidebar;
