import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import * as THREE from "three";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";

function App() {
  const [data, setData] = useState({
    members: [],
    nodes: [],
  });

  // Function to fetch and read the Excel file from the public folder
  const readExcelFile = async (sheetNumber) => {
    try {
      const response = await fetch("/Sample.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[sheetNumber];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (sheetNumber === 0) {
        setData((prev) => ({ ...prev, members: jsonData }));
      } else {
        setData((prev) => ({ ...prev, nodes: jsonData }));
      }
    } catch (error) {
      console.error("Error reading the Excel file:", error);
    }
  };

  useEffect(() => {
    readExcelFile(0); // Reading the members data
    readExcelFile(1); // Reading the nodes data
  }, []);

  return (
    <>
      <h1>Three Js Graphic</h1>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {data.members.length > 0 &&
          data.nodes.length > 0 &&
          data.members.slice(1).map((member) => {
            const startNode = data.nodes[member[1]];
            const endNode = data.nodes[member[2]];

            if (startNode && endNode) {
              const points = [
                [startNode[1], startNode[2], startNode[3]],
                [endNode[1], endNode[2], endNode[3]],
              ];

              return (
                <Line
                  key={member[0]}
                  points={points}
                  color="black"
                  lineWidth={1}
                  segments
                />
              );
            }
            return null;
          })}
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
