import React from "react";
import EntityManager from "./EntityManager";

export default function ManageCategories({ subjectId }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Category Name" },
    { key: "weight", label: "Weight" },
  ];

  return (
    <EntityManager
      fetchData={() => window.api.getCategories(subjectId)}
      createItem={(data) => window.api.addCategory(subjectId, data.name, data.weight)}
      updateItem={(id, data) => window.api.updateCategory(id, data.name, data.weight)}
      deleteItem={(id) => window.api.deleteCategory(id)}
      columns={columns}
    />
  );
}
