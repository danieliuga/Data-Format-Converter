import yaml from 'js-yaml';

export const validateCSV = (csvText: string, file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv') {
        return false;
    }

    if (!csvText.trim()) {
        return false;
    }

    const rows = csvText.trim().split('\n');

    if (rows.length === 0) {
        return false;
    }

    const headerColumns = rows[0].split(',').length;
    if (headerColumns === 0) {
        return false;
    }

    for (const row of rows.slice(1)) {
        const columns = row.split(',');
        if (columns.length !== headerColumns) {
            return false;
        }
    }

    return true;
};


export const validateJSON = (jsonText: string): boolean => {
    try {
        JSON.parse(jsonText);
        return true;
    } catch (e) {
        return false;
    }
};

export const validateXML = (xmlText: string, file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xml') {
        return false;
    }

    if (!xmlText.trim()) {
        return false;
    }

    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
};

export const validateYAML = (yamlText: string, file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'yaml' && fileExtension !== 'yml') {
        return false;
    }

    if (!yamlText.trim()) {
        return false;
    }

    try {
        yaml.load(yamlText);
        return true;
    } catch (e) {
        return false;
    }
};
