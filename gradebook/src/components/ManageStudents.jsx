import React from "react";
import EntityManager from "./EntityManager";

export default function ManageStudents() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
  ];

  return (
    <EntityManager
      entityName="student"
      fetchData={window.api.getStudents}
      createRow={(data) => window.api.addStudent(data.first_name, data.last_name)}
      updateRow={(id, data) => window.api.updateStudent(id, data.first_name, data.last_name)}
      deleteRow={(id) => window.api.deleteStudent(id)}
      columns={columns}
    />
  );
}
