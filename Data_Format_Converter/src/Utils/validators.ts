export const validateCSV = (csvText: string): boolean => {
  // if (!csvText.trim()) return false;

  // const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);

  // if (rows.length < 2) return false;

  // const headers = rows[0].split(',');

  // if (headers.length === 0 || headers.includes('')) return false;

  // const csvPattern = /^[\w\s\d,.-]+$/;

  // for (let i = 1; i < rows.length; i++) {
  //   const row = rows[i].split(',');

  //   if (row.length !== headers.length) return false;

  //   if (!csvPattern.test(rows[i])) return false;
  // }

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
