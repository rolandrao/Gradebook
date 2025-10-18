import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function CreateAssignmentModal({ show, handleClose, subjectName, subjectID, onAssignmentCreated }) {
  const [title, setTitle] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [categories, setCategories] = useState([]); 
  const [unitID, setUnitID] = useState("");
  const [units, setUnits] = useState([]);
  const [dueDate, setDueDate] = useState("");


  const fetchData = async () => {
      const [categories, units] = await Promise.all([
        window.api.getCategories(subjectID),
        window.api.getUnits(subjectID),
      ]);

      setCategories(categories);
      if (categories.length > 0) {
        setCategoryID(categories[0].id)
      }

      setUnits(units);

      if (units.length > 0) {
        setUnitID(units[0].id);
      }

  }

  // Load categories when modal opens
  useEffect(() => {
    if (show && subjectID) {
      fetchData();
    }
  }, [show, subjectName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !maxScore || !categoryID) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await window.api.addAssignment(
        subjectID,
        unitID,
        categoryID,
        title,
        parseInt(maxScore, 10),
        dueDate
      );

      // Reset form
      setTitle("");
      setMaxScore("");
      if (categories.length > 0) setCategoryID(categories[0].id);

      // Refresh parent
      if (onAssignmentCreated) onAssignmentCreated();

      handleClose();
    } catch (err) {
      console.error("Error creating assignment:", err);
      alert("Failed to create assignment. See console for details.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Assignment</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Unit</Form.Label>
            <Form.Select
              value={unitID}
              onChange={(e) => setUnitID(e.target.value)}
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Max Score</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter max score"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
