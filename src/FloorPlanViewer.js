// FloorPlanViewer.js
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import jsPDF from 'jspdf';

import './FloorPlanViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const FloorPlanViewer = ({ pdfFiles }) => {
  const [scales, setScales] = useState({});
  const [pageSizes, setPageSizes] = useState({});
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const canvasRef = useRef(null);

  const handleScaleChange = (newScale) => {
    setScales((prevScales) => ({ ...prevScales, [currentFileIndex]: newScale }));
    renderCanvas();
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSizes((prevPageSizes) => ({ ...prevPageSizes, [currentFileIndex]: newPageSize }));
    renderCanvas();
  };

  const onDocumentLoadSuccess = async ({ numPages }) => {
    renderCanvas();
  };

  const exportPdf = async () => {
    const canvas = canvasRef.current;

    try {
      const canvasDataUrl = canvas.toDataURL('image/png');
      const img = new Image();
      img.src = canvasDataUrl;

      const pdf = new jsPDF({
        orientation: pageSizes[currentFileIndex] === 'A4' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: pageSizes[currentFileIndex],
      });

      pdf.addImage(img, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`scaled_pdf_${currentFileIndex + 1}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };







  const renderCanvas = async () => {
    const pageNumber = 1;
    console.log('Rendering canvas for page:', pageNumber);

    try {
      const pdfDocument = await pdfjs.getDocument(pdfFiles[currentFileIndex].file).promise;
      const pdfPage = await pdfDocument.getPage(1);
      const viewport = pdfPage.getViewport({ scale: scales[currentFileIndex] || 1 });

      canvasRef.current.width = viewport.width;
      canvasRef.current.height = viewport.height;

      const renderContext = {
        canvasContext: canvasRef.current.getContext('2d'),
        viewport,
      };

      pdfPage.render(renderContext);

      const pdfWidth = viewport.width;
      const pdfHeight = viewport.height;

      const startPoint = { x: 0, y: 0 };
      const endPoint = { x: pdfWidth, y: pdfHeight };

      console.log('PDF Dimensions:', pdfWidth, 'x', pdfHeight);
      console.log('Start Point:', startPoint);
      console.log('End Point:', endPoint);
    } catch (error) {
      console.error('Error rendering canvas:', error);
    }
  };

  const handleFileChange = (index) => {
    setCurrentFileIndex(index);
    renderCanvas();
  };

  return (
    <div className="floor-plan-container">
      <div className="controls-container">
        <label>
          Scale:
          <select
            value={scales[currentFileIndex] || 1}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          >
            <option value={1}>1:100</option>
            <option value={1.5}>1:200</option>
            <option value={1.75}>1:300</option>
            <option value={0.5}>1:50</option>
          </select>
        </label>

        <label>
          Page Size:
          <select
            value={pageSizes[currentFileIndex] || 'A4'}
            onChange={(e) => handlePageSizeChange(e.target.value)}
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="A2">A2</option>
          </select>
        </label>

        <label>
          Select PDF File:
          <select value={currentFileIndex} onChange={(e) => handleFileChange(e.target.value)}>
            {pdfFiles.map((file, index) => (
              <option key={index} value={index}>
                {file.name}
              </option>
            ))}
          </select>
        </label>

        <button onClick={exportPdf}>Export Scaled PDF</button>
      </div>

      <div className="pdf-container">
        <Document file={pdfFiles[currentFileIndex].file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={1}
            scale={scales[currentFileIndex]}
            width={pageSizes[currentFileIndex] === 'A4' ? 595 : pageSizes[currentFileIndex] === 'A3' ? 842 : 1191}
            style={{  border: 1 }}
          />
        </Document>
      </div>
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
};



export default FloorPlanViewer;
