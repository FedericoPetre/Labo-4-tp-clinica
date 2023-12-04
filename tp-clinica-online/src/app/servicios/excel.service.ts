import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  crearExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Ajustar el ancho de las columnas según el contenido
    const columnWidths = this.obtenerAnchoColumnas(data);

    // Configurar el ancho de las columnas 
    columnWidths.forEach((width, colIndex) => {
      const col = XLSX.utils.encode_col(colIndex); // Convertir el índice de columna a letra
      ws['!cols'] = ws['!cols'] || [];
      ws['!cols'][colIndex] = { wch: width }; // Usar wch en lugar de width
    });

    data.forEach((row: any, rowIndex) => {
      Object.keys(row).forEach((key, colIndex) => {
        const cell = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        if (ws[cell] && ws[cell].t === 's') {
          ws[cell].s = { alignment: { horizontal: 'center', vertical: 'center' } };
        }
      });
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja Registros');

    //solo lectura
    ws['!protect'] = {
      selectLockedCells: false,
      selectUnlockedCells: false,
    };

    XLSX.writeFile(wb, fileName + '.xlsx');
  }

  obtenerAnchoColumnas(datos: any[]): Array<number> {
    const columnCount = datos.length > 0 ? Object.keys(datos[0]).length : 0;

    // Inicializar el ancho mínimo de las columnas
    const ancho: Array<number> = Array(columnCount).fill(20);

    // Actualizar el ancho de las columnas basado en la longitud del contenido
    datos.forEach((row: any) => {
      Object.keys(row).forEach((key, index) => {
        const cellLength = String(row[key]).length;
        if (cellLength > ancho[index]) {
          ancho[index] = cellLength;
        }
      });
    });

    return ancho;
  }

  descargarExcel(arrayDatos: any[], nombreArchivo: string){
    this.crearExcel(arrayDatos, nombreArchivo);
  }
}
