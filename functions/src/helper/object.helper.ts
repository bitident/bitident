export function sortObject(o: any) {
    return Object.keys(o).sort().reduce((r: any, k) => {r[k] = o[k]; return r}, {});
}