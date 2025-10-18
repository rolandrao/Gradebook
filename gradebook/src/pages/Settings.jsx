import React, { useState } from "react";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import ManageSubjects from "../components/ManageSubjects";
import ManageStudents from "../components/ManageStudents";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const navigate = useNavigate();
  const tabs = ["Subjects", "Students"];

  // Define columns and API functions for each entity
  const entities = {
    Subjects: {
      columns: [
        { key: "id", label: "ID" },
        { key: "name", label: "Subject Name" },
      ],
      fetchData: window.api.getSubjects,
      addRow: async ({ name }) => window.api.addSubject(name),
      updateRow: async (id, { name }) => window.api.updateSubject(id, name),
      deleteRow: window.api.deleteSubject,
    },
    Students: {
      columns: [
        { key: "id", label: "ID" },
        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },
      ],
      fetchData: window.api.getStudents,
      addRow: async ({ first_name, last_name }) => window.api.addStudent(first_name, last_name),
      updateRow: async (id, { first_name, last_name }) => window.api.updateStudent(id, first_name, last_name),
      deleteRow: window.api.deleteStudent,
    },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>

      <TabGroup>
        <TabList className="flex space-x-2 border-b border-gray-200 mb-4">
            <Tab className="px-4 py-2 font-medium rounded-t-lg">Subjects</Tab>
            <Tab className="px-4 py-2 font-medium rounded-t-lg">Students</Tab>
        </TabList>

        <TabPanels>
            <TabPanel className="bg-white p-4 rounded-b-lg borer border-gray-300">
                <ManageSubjects />
            </TabPanel>
            <TabPanel className="bg-white p-4 rounded-b-lg borer border-gray-300">
                <ManageStudents />
            </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
