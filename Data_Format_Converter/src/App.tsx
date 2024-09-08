import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import FileUploader from './Components/FileUploader';
import FormatConverter from './Components/FormatConverter';
import OutputDisplay from './Components/OutputDisplay';
import DataVisualizer from './Components/DataVisualizer';
import Assistant from './Components/Assistant';
import './App.css';

// los conversores probarlos porque no funcionan todos muy bien
// conversor json to csv:- si funciona
// conversor json to xml:- si funciona -> si o si
// conversor xml to json:- si funciona -> si o si
// conversor csv to json:- si funciona -> si o si
// conversor csv to xml:- si funciona
// conversor yaml to json:- si funciona -> si o si
// conversor yaml to xml:- si funciona -> si o si

// conversor xml to csv:- no funciona

// conversor xlsx to csv:- no funciona -> si o si
// conversor json to xlsx:- no funciona
// conversor xml to xlsx:- no funciona
// conversor csv to xlsx:- no funciona
// conversor xlsx to json:- no funciona
// conversor xlsx to xml:- no funciona

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [convertedOutput, setConvertedOutput] = useState<string>('');
  const [downloadType, setDownloadType] = useState<string>('csv');
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [previewType, setPreviewType] = useState<'original' | 'converted'>('original');
  const [isAssistantVisible, setAssistantVisible] = useState<boolean>(false);

  const handleFileUpload = (content: string, type: string) => {
    setFileContent(content);
    setFileType(type);
  };

  const handleConversion = (result: string) => {
    setConvertedOutput(result);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
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

  const handlePreview = (type: 'original' | 'converted') => {
    setPreviewType(type);
    setPopupVisible(true);
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
            <button onClick={() => handlePreview('original')}>Show Preview</button>
            <button onClick={() => handleDownload(fileContent, fileType)}>Download</button>
            <button onClick={() => handleCopy(fileContent)}>Copy</button>
          </div>
          <p className='subtitle'>File Content:</p>
          {fileContent && (
            <div className="fileData">
              <pre>{fileContent}</pre>
              {/* <DataVisualizer data={fileContent} dataType={fileType} onDataChange={handleDataChange} /> */}
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
            <button onClick={() => handlePreview('converted')}>Show Preview</button>
            <button onClick={() => handleDownload(convertedOutput, downloadType)}>Download</button>
            <button onClick={() => handleCopy(convertedOutput)}>Copy</button>
          </div>
          <p className='subtitle'>Converted Output:</p>
          {convertedOutput && (
            <div className='convertedData'>
              <OutputDisplay output={convertedOutput} />
              {/* <DataVisualizer data={convertedOutput} dataType={downloadType} onDataChange={handleDataChange} /> */}
            </div>
          )}
        </div>
      </div>
      <Modal
        title="Preview"
        visible={isPopupVisible}
        onCancel={() => setPopupVisible(false)}
        footer={null}
        width={800}
      >
        {previewType === 'original' && fileContent && (
          <DataVisualizer data={fileContent} dataType={fileType} onDataChange={handleDataChange} />
        )}
        {previewType === 'converted' && convertedOutput && (
          <DataVisualizer data={convertedOutput} dataType={downloadType} onDataChange={handleDataChange} />
        )}
      </Modal>
      <Button
        type="primary"
        onClick={() => setAssistantVisible(true)}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Assistant
      </Button>
      <Assistant
        isVisible={isAssistantVisible}
        onClose={() => setAssistantVisible(false)}
      />
    </div>
  );
};

export default App;
