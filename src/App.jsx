import { useState } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 72 },
  { id: 3, name: "Charlie", score: 94 },
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);

  const [studentCount, setStudentCount] = useState(3);
  const [averageScore, setAverageScore] = useState(83.67);
  const [passingCount, setPassingCount] = useState(3);

  const [showPassingOnly, setShowPassingOnly] = useState(false);
  const [visibleStudents, setVisibleStudents] = useState(initialStudents);

  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");

  function updateStatistics(updatedStudents) {
    setStudentCount(updatedStudents.length);

    const total = updatedStudents.reduce(
      (sum, student) => sum + student.score,
      0,
    );

    const average =
      updatedStudents.length > 0 ? total / updatedStudents.length : 0;

    setAverageScore(average);

    const passing = updatedStudents.filter(
      (student) => student.score >= 70,
    ).length;

    setPassingCount(passing);
  }

  function updateVisibleStudents(updatedStudents, passingOnly) {
    if (passingOnly) {
      setVisibleStudents(
        updatedStudents.filter((student) => student.score >= 70),
      );
    } else {
      setVisibleStudents(updatedStudents);
    }
  }

  function changeScore(id, amount) {
    const updatedStudents = students.map((student) =>
      student.id === id
        ? {
            ...student,
            score: Math.max(0, Math.min(100, student.score + amount)),
          }
        : student,
    );

    setStudents(updatedStudents);
    updateStatistics(updatedStudents);
    updateVisibleStudents(updatedStudents, showPassingOnly);
  }

  function addStudent(event) {
    event.preventDefault();

    if (!newName.trim() || newScore === "") {
      return;
    }

    const score = Number(newScore);

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return;
    }

    const nextId = Math.max(0, ...students.map((student) => student.id)) + 1;

    const newStudent = {
      id: nextId,
      name: newName.trim(),
      score,
    };

    const updatedStudents = [...students, newStudent];

    setStudents(updatedStudents);
    updateStatistics(updatedStudents);
    updateVisibleStudents(updatedStudents, showPassingOnly);

    setNewName("");
    setNewScore("");
  }

  function deleteStudent(id) {
    const updatedStudents = students.filter((student) => student.id !== id);

    setStudents(updatedStudents);
    updateStatistics(updatedStudents);
    updateVisibleStudents(updatedStudents, showPassingOnly);
  }

  function handleFilterChange(event) {
    const checked = event.target.checked;

    setShowPassingOnly(checked);
    updateVisibleStudents(students, checked);
  }

  return (
    <main className="container">
      <h1>Student Gradebook</h1>

      <section className="summary">
        <div>
          <h2>Students</h2>
          <p>{studentCount}</p>
        </div>

        <div>
          <h2>Average Score</h2>
          <p>{averageScore.toFixed(1)}%</p>
        </div>

        <div>
          <h2>Passing</h2>
          <p>{passingCount}</p>
        </div>
      </section>

      <section className="controls">
        <button onClick={() => setShowPassingOnly(!showPassingOnly)}>
          {showPassingOnly ? "Show All Students" : "Show Passing Only"}
        </button>
      </section>

      <section>
        <h2>Student Scores</h2>

        <ul className="student-list">
          {visibleStudents.map((student) => (
            <li key={student.id}>
              <span>{student.name}</span>

              <div className="score-controls">
                <button
                  onClick={() => changeScore(student.id, -5)}
                  disabled={student.score === 0}
                >
                  -
                </button>

                <span>{student.score}%</span>

                <button
                  onClick={() => changeScore(student.id, 5)}
                  disabled={student.score === 100}
                >
                  +
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="add-student">
        <h2>Add Student</h2>

        <form onSubmit={addStudent}>
          <input
            type="text"
            placeholder="Student name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />

          <input
            type="number"
            placeholder="Score"
            min="0"
            max="100"
            value={newScore}
            onChange={(event) => setNewScore(event.target.value)}
          />

          <button type="submit">Add Student</button>
        </form>
      </section>
    </main>
  );
}
