import yaml from 'js-yaml';

export const validateCSV = (csvText: string, file: File): boolean => {
    // Verificar la extensión del archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv') {
        return false; // Si la extensión no es CSV, retorna false
    }

    // Verificar que el contenido no esté vacío
    if (!csvText.trim()) {
        return false;
    }

    // Dividir el contenido en filas
    const rows = csvText.trim().split('\n');

    // Verificar que al menos haya una fila (cabeceras o datos)
    if (rows.length === 0) {
        return false;
    }

    // Verificar que la primera fila (encabezado) tenga al menos una columna
    const headerColumns = rows[0].split(',').length;
    if (headerColumns === 0) {
        return false;
    }

    // Opcional: Verificar que todas las demás filas tengan el mismo número de columnas
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
    // Verificar la extensión del archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xml') {
        return false; // Si la extensión no es XML, retorna false
    }

    // Verificar que el contenido no esté vacío
    if (!xmlText.trim()) {
        return false;
    }

    // Validar la estructura XML básica usando un parser
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Verificar si hay errores de parseo
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            return false; // Si hay un error de parseo, el contenido no es un XML válido
        }

        return true; // Si no hay errores, es un XML válido
    } catch (e) {
        return false; // Captura cualquier error inesperado
    }
};

export const validateYAML = (yamlText: string, file: File): boolean => {
    // Verificar la extensión del archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'yaml' && fileExtension !== 'yml') {
        return false; // Si la extensión no es YAML, retorna false
    }

    // Verificar que el contenido no esté vacío
    if (!yamlText.trim()) {
        return false;
    }

    // Intentar parsear el contenido YAML
    try {
        yaml.load(yamlText);
        return true; // Si el contenido se parsea sin errores, es un YAML válido
    } catch (e) {
        return false; // Si ocurre un error durante el parseo, el contenido no es YAML válido
    }
};
