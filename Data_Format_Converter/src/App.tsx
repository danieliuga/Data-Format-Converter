import React, { useState } from 'react';
import { Button } from 'antd';
import FileUploader from './Components/FileUploader';
import FormatConverter from './Components/FormatConverter';
import OutputDisplay from './Components/OutputDisplay';
import DataVisualizer from './Components/DataVisualizer';
import Assistant from './Components/Assistant';

import downloadPNGIcon from '/descargarPNG.png';
import copiarPNGIcon from '/copiarPNG.png';
import importFileIcon from '/importFile.png';
import uploadFileIcon from '/uploadFile.png';

import './App.css';

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [convertedOutput, setConvertedOutput] = useState<string>('');
  const [downloadType, setDownloadType] = useState<string>('csv');
  const [previewType] = useState<'original' | 'converted'>('original');
  const [isAssistantVisible, setAssistantVisible] = useState<boolean>(false);
  const [textCopyFile, setTextCopyFile] = useState<string>('Copy');
  const [textCopyConverted, setTextCopyConverted] = useState<string>('Copy');
  
  const handleFileUpload = (content: string, type: string) => {
    setFileContent(content);
    setFileType(type);
  };

  const handleConversion = (result: string) => {
    setConvertedOutput(result);
  };

  const handleCopyFile = () => {
    if (!fileContent) return;
    setTextCopyFile('Copied');
    setTimeout(() => {
      setTextCopyFile('Copy');
    }, 5000);
    navigator.clipboard.writeText(fileContent)
      .then(() => {
        console.log('File content copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy file content: ', err);
      });
  };

  const handleCopyConverted = () => {
    if (!convertedOutput) return;
    setTextCopyConverted('Copied');
    setTimeout(() => {
      setTextCopyConverted('Copy');
    }, 5000);
    navigator.clipboard.writeText(convertedOutput)
      .then(() => {
        console.log('Converted output copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy converted output: ', err);
      });
  };

  const handleDownload = (content: string, type: string) => {
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTargetFormatChange = (targetFormat: string) => {
    setDownloadType(targetFormat);
  };

  const handleDataChange = (newData: string) => {
    if (previewType === 'original') {
      setFileContent(newData);
    } else {
      setConvertedOutput(newData);
    }
  };

  return (
    <div className="App">
      <div className='title'>
        <p>Data Format Converter</p>
      </div>
      <div className="main-content">
        <div className='uploadFile'>
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
        <div className="fileContent">
          <div className='fileButtons'>
            <p className='subtitle'>File Content:</p>
            <div
              onClick={() => handleDownload(fileContent, fileType)}
              className='downloadButton'
              style={{
                cursor: fileType ? 'pointer' : 'not-allowed',
                opacity: convertedOutput ? 1 : 0.5,
                height: '100%',
                width: '100%' 
              }}
            >
              <img
                src={downloadPNGIcon}
                alt='Download'
                className='imgPhoto'
              />
              <p></p>
            </div>
            <div
              onClick={() => handleCopyFile()}
              className='copyButton'
              style={{
                cursor: fileType ? 'pointer' : 'not-allowed',
                opacity: fileType ? 1 : 0.5,
              }}
            >
              <img
                src={copiarPNGIcon}
                alt={textCopyFile}
                className='imgPhotoCopy'
                style={{ marginRight: '0.2vmax' }}
              />
              <p>{textCopyFile}</p>
            </div>
          </div>
          {fileContent ? (
            <div className="fileData">
              <DataVisualizer
                data={fileContent}
                dataType={fileType}
                onDataChange={handleDataChange}
                isReadOnly='original'
              />
            </div>
          ) : (
            <div className="placeholder">
              <img src={uploadFileIcon} alt="No file selected" className="placeholderIcon" />
            </div>
          )}
        </div>
        <div className="formatConverter">
          <FormatConverter
            fileContent={fileContent}
            fileType={fileType}
            onConversion={handleConversion}
            onTargetFormatChange={handleTargetFormatChange}
          />
        </div>
        <div className="convertedOutput">
          <div className='convertedButtons'>
            <p className='subtitle'>Converted Output:</p>
            <div
              onClick={() => handleDownload(convertedOutput, downloadType)}
              className='downloadButton'
              style={{ 
                cursor: convertedOutput ? 'pointer' : 'not-allowed',
                opacity: convertedOutput ? 1 : 0.5 
              }}
            >
              <img
                src={downloadPNGIcon}
                alt='Download'
                className='imgPhoto'
              />
            </div>
            <div
              onClick={() => handleCopyConverted()}
              className='copyButton'
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: convertedOutput ? 'pointer' : 'not-allowed',
                opacity: convertedOutput ? 1 : 0.5,
              }}
            >
              <img
                src={copiarPNGIcon}
                alt={textCopyConverted}
                className='imgPhoto'
                style={{ marginRight: '0.5vmax' }}
              />
              <p>{textCopyConverted}</p>
            </div>
          </div>
          {convertedOutput ? (
            <div className='convertedData'>
              <OutputDisplay output={convertedOutput} />
              <DataVisualizer
                data={convertedOutput}
                dataType={downloadType}
                onDataChange={handleDataChange}
                isReadOnly='converted'
              />
            </div>
          ) : (
            <div className="placeholder">
              <img src={importFileIcon} alt="No file selected" className="placeholderIcon" />
            </div>
          )}
        </div>
      </div>
      <Button
        type="primary"
        onClick={() => setAssistantVisible(true)}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Assistant
      </Button>
      {isAssistantVisible && <Assistant isVisible={isAssistantVisible} onClose={() => setAssistantVisible(false)} />}
    </div>
  );
};

export default App;
