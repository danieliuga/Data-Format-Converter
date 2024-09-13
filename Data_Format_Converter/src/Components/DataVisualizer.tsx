import React, { ChangeEvent, useEffect, useState } from 'react';
import { Tree, Table, Input } from 'antd';
import * as d3 from 'd3';
import './DataVisualizer.css';

interface DataVisualizerProps {
    data: string;
    dataType: string;
    onDataChange: (newData: string) => void;
    isReadOnly: 'original' | 'converted';
}

interface TreeNode {
    title: string;
    key: string;
    children?: TreeNode[];
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ data, dataType, onDataChange, isReadOnly }) => {
    const [editableData, setEditableData] = useState<string>(data);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setEditableData(data);
    }, [data]);

    const handleDataChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setEditableData(e.target.value);
        onDataChange(e.target.value);
    };

    const renderJson = (data: string) => {
        try {
            const jsonData = JSON.parse(data);
            return <Tree treeData={convertJsonToTree(jsonData)} />;
        } catch (error) {
            return <p>Error al parsear JSON</p>;
        }
    };

    const renderCsv = (data: string) => {
        try {
            const rows = d3.csvParse(data);
            const filteredRows = rows.filter(row =>
                Object.values(row).some(value => value.includes(searchTerm))
            );
            return (
                <>
                    <Input
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                    />
                    <Table dataSource={filteredRows} columns={generateTableColumns(filteredRows)} />
                </>
            );
        } catch (error) {
            return <p>Error al parsear CSV</p>;
        }
    };

    const renderXml = (data: string) => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            return <Tree treeData={convertXmlToJsonTree(xmlDoc)} />;
        } catch (error) {
            return <p>Error al parsear XML</p>;
        }
    };

    if (!data) return null;

    console.log('isreadonly: ' + isReadOnly);


    return (
        <div className="data-visualizer">
            {dataType !== 'yaml' && (
                <>
                    {isReadOnly === 'original' && (
                        <Input.TextArea
                            value={editableData}
                            onChange={handleDataChange}
                            rows={10}
                        />
                    )}
                    <h2>Tree Map</h2>
                    <div>
                        {dataType === 'json' && renderJson(isReadOnly === 'original' ? editableData : data)}
                        {dataType === 'csv' && renderCsv(isReadOnly === 'original' ? editableData : data)}
                        {dataType === 'xml' && renderXml(isReadOnly === 'original' ? editableData : data)}
                    </div>
                </>
            )}
        </div>
    );    
};

const convertJsonToTree = (jsonData: any): TreeNode[] => {
    if (Array.isArray(jsonData)) {
        return jsonData.map((item, index) => ({
            title: `Item ${index}`,
            key: `item-${index}`,
            children: typeof item === 'object' ? convertJsonToTree(item) : [{ title: String(item), key: `item-${index}-value` }],
        }));
    } else if (typeof jsonData === 'object' && jsonData !== null) {
        return Object.keys(jsonData).map((key) => ({
            title: key,
            key,
            children: typeof jsonData[key] === 'object'
                ? convertJsonToTree(jsonData[key])
                : [{ title: String(jsonData[key]), key: `${key}-value` }],
        }));
    } else {
        return [{ title: String(jsonData), key: 'root' }];
    }
};

const generateTableColumns = (rows: any[]): { title: string; dataIndex: string; key: string }[] => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key,
    }));
};

const convertXmlToJsonTree = (xmlDoc: Document): TreeNode[] => {
    const traverseNode = (node: Element): TreeNode => {
        const children: TreeNode[] = Array.from(node.children).map(traverseNode);
        const attributes = Array.from(node.attributes).map((attr) => ({
            title: `${attr.name}: ${attr.value}`,
            key: `${node.nodeName}-attr-${attr.name}`,
        }));
        const value = node.textContent?.trim() && !node.children.length ? [{
            title: node.textContent,
            key: `${node.nodeName}-value`,
        }] : [];

        return {
            title: node.nodeName,
            key: node.nodeName,
            children: [...attributes, ...children, ...value],
        };
    };

    const root = xmlDoc.documentElement;
    return [traverseNode(root)];
};

export default DataVisualizer;
