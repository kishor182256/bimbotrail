// App.js
import React, { useState } from 'react';
import FloorPlanViewer from './FloorPlanViewer';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ file, name: file.name }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleLevelButtonClick = (level) => {
    setSelectedLevel(level);
    console.log("handleLevelButtonClick",level)
  };

  return (
    <div>
      <h1>Bimbots Test Scale and PDF Page Size</h1>

      {/* File Upload */}
      <label>
        Upload PDF:
        <input type="file" accept=".pdf" multiple onChange={handleFileChange} />
      </label>

      <div>
        <button onClick={() => handleLevelButtonClick('L1')}>L1</button>
        <button onClick={() => handleLevelButtonClick('L2')}>L2</button>
        <button onClick={() => handleLevelButtonClick('L3')}>L3</button>
        <button onClick={() => handleLevelButtonClick('L4')}>L4</button>
      </div>

      {/* Display Floor Plan Viewer if files are selected */}
      {selectedFiles.length > 0 && <FloorPlanViewer pdfFiles={selectedFiles} />}
    </div>
  );
};

export default App;
