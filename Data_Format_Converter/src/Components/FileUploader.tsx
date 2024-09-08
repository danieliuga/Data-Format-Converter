import React, { useState } from "react";
import { validateCSV, validateJSON } from "../Utils/validators";
import { message } from 'antd';

interface FileUploaderProps {
  onFileUpload: (fileContent: string, fileType: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [fileType, setFileType] = useState<string>('json');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
  
        try {
          if (fileType === 'json') {
            if (validateJSON(text)) {
              onFileUpload(text, 'json');
            } else {
              message.error('Invalid JSON');
            }
          } else if (fileType === 'csv') {
            if (validateCSV(text)) {
              onFileUpload(text, 'csv');
            } else {
              message.error('Invalid CSV');
            }
          } else if (fileType === 'xml') {
            onFileUpload(text, 'xml');
          } else if (fileType === 'yaml') {
            onFileUpload(text, 'yaml');
          } else if (fileType === 'xlsx') {
            onFileUpload(text, 'xlsx');
          } else {
            message.error('Unsupported file type');
          }
        } catch (error) {
          message.error('Error reading file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="xml">XML</option>
        <option value="yaml">YAML</option>
        <option value="xlsx">Excel (XLSX)</option>
      </select>
      <input type="file" accept=".json,.csv,.xml,.yaml,.yml,.xlsx" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;


// import React, { useState } from "react";

// interface FileUploaderProps {
//   onFileUpload: (fileContent: string, fileType: string) => void;
// }

// const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
//   const [fileType, setFileType] = useState<string>('json');

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         onFileUpload(e.target?.result as string, fileType);
//       };
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div>
//       <select className="" value={fileType} onChange={(e) => setFileType(e.target.value)}>
//         <option value="json">JSON</option>
//         <option value="csv">CSV</option>
//         <option value="xml">XML</option>
//       </select>
//       <input className="" type="file" accept=".json,.csv,.xml" onChange={handleFileChange} />
//     </div>
//   );
// };

// export default FileUploader;
