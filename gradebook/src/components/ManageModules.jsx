import React from "react";
import EntityManager from "./EntityManager";

export default function ManageModules({ subjectId }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Module Name" },
  ];

  return (
    <EntityManager
      fetchData={() => window.api.getUnits(subjectId)}
      createItem={(data) => window.api.addUnit(subjectId, data.name)}
      updateItem={(id, data) => window.api.updateUnit(id, data.name)}
      deleteItem={(id) => window.api.deleteUnit(id)}
      columns={columns}
    />
  );
}
