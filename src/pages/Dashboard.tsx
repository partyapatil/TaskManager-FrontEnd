import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import UserInfo from "../components/UserInfo";
import { useGetDashboardstatsQuery } from "../redux/slices/taskApislice";
import { useSelector } from "react-redux";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-200">
      <tr className="text-left">
        <th className="py-3 px-2 font-medium text-gray-500">Task</th>
        <th className="py-3 px-2 font-medium text-gray-500">Priority</th>
        <th className="py-3 px-2 font-medium text-gray-500">Team</th>
        <th className="py-3 px-2 font-medium text-gray-500 hidden md:block">Date</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div
            className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="font-medium">{task.title}</p>
        </div>
      </td>

      <td className="py-3 px-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize text-sm">{task.priority}</span>
        </div>
      </td>

      <td className="py-3 px-2">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-3 px-2 hidden md:block">
        <span className="text-sm text-gray-500">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full md:w-2/3 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className="border-b border-gray-200">
      <tr className="text-left">
        <th className="py-3 px-2 font-medium text-gray-500">Member</th>
        {/* <th className="py-3 px-2 font-medium text-gray-500">Status</th> */}
        <th className="py-3 px-2 font-medium text-gray-500">Joined</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-gradient-to-r from-blue-500 to-purple-500">
            <span className="text-center">{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
        </div>
      </td>

      {/* <td className="py-3 px-2">
        <p
          className={clsx(
            "w-fit px-2 py-1 rounded-full text-xs font-medium",
            user?.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td> */}
      <td className="py-3 px-2 text-sm text-gray-500">
        {moment(user?.createdAt).fromNow()}
      </td>
    </tr>
  );

  return (
    <div className="w-full md:w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Team Members</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {users?.map((user, index) => (
              <TableRow key={index + user?._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [datatask, setData] = useState(null);
  const allData = useSelector((state) => state.auth.allData);
  const fullState = useSelector((state) => state);
  const { data, error, isLoading } = useGetDashboardstatsQuery();
console.log(data)
  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: data?.tasks?.completed || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: data?.tasks?.inProgress || 0,
      icon: <LuClipboardList />,
      bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    },
    {
      _id: "4",
      label: "TODOS",
      total: data?.tasks?.todo || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-gradient-to-r from-pink-500 to-pink-600",
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className={`h-32 rounded-xl shadow-sm ${bg} p-5 text-white flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <span className="text-2xl font-bold">{count}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {React.cloneElement(icon, { className: "text-xl" })}
          </div>
        </div>
        <div className="text-xs opacity-80">{"110 last month"}</div>
      </div>
    );
  };

  return (
    <div className="py-4 px-2 md:px-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

     
    {/* Chart Section */}
    <div className="w-full mb-12 bg-white/40 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-6">
      <h4 className="text-xl text-gray-800 font-semibold mb-4">📊 Chart by Priority</h4>
      <Chart data={data?.graphData} />
    </div>

      <div className="flex flex-col md:flex-row gap-4">
        <TaskTable tasks={data?.last10Task} />
        <UserTable users={data?.users} />
      </div>
    </div>
  );
};

export default Dashboard;