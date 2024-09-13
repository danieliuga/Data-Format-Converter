import React, { useState } from "react";
import { validateCSV, validateJSON, validateXML, validateYAML } from "../Utils/validators";
import { message } from 'antd';

interface FileUploaderProps {
  onFileUpload: (fileContent: string, fileType: string) => void;
}

const MAX_FILE_SIZE_MB = 5;

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [fileType, setFileType] = useState<string>('json');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        message.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

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
            const isValid = validateCSV(text, file);
            if (isValid) {
              onFileUpload(text, 'csv');
            } else {
              message.error('Invalid CSV');
            }
          } else if (fileType === 'xml') {
            const isValid = validateXML(text, file);
            if (isValid) {
              onFileUpload(text, 'xml');
            } else {
              message.error('Invalid XML');
            }
          } else if (fileType === 'yaml') {
            const isValid = validateYAML(text, file);
            if (isValid) {
              onFileUpload(text, 'yaml');
            } else {
              message.error('Invalid YAML');
            }

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
      </select>
      <input type="file" accept=".json,.csv,.xml,.yaml,.yml,.xlsx" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
