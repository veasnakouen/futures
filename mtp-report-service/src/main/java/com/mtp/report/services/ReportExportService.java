package com.mtp.report.services;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ReportExportService {

    private static final String[] HEADERS = {
            "Employee ID", "Employee Name", "Department", "Position",
            "Current Salary", "Join Date", "Status", "Total Records",
            "Present", "Late", "Absent"
    };

    private static final String[] KEYS = {
            "EmployeeID", "EmployeeName", "Department", "Position",
            "CurrentSalary", "JoinDate", "Status", "TotalAttendanceRecords",
            "DaysPresent", "DaysLate", "DaysAbsent"
    };

    public byte[] generateExcelReport(List<Map<String, Object>> data) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Employee Evaluation");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Create Header Row
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }

            // Populate Data
            int rowIdx = 1;
            for (Map<String, Object> rowData : data) {
                Row row = sheet.createRow(rowIdx++);
                for (int colIdx = 0; colIdx < KEYS.length; colIdx++) {
                    Object value = rowData.get(KEYS[colIdx]);
                    Cell cell = row.createCell(colIdx);
                    if (value != null) {
                        if (value instanceof Number) {
                            cell.setCellValue(((Number) value).doubleValue());
                        } else {
                            cell.setCellValue(value.toString());
                        }
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel", e);
        }
    }

    public byte[] generatePdfReport(List<Map<String, Object>> data) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate()); // Landscape for wide tables
            PdfWriter.getInstance(document, out);

            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Employee Evaluation Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Table
            PdfPTable table = new PdfPTable(HEADERS.length);
            table.setWidthPercentage(100);

            // Set relative widths
            float[] columnWidths = { 2f, 3f, 3f, 3f, 2f, 2f, 2f, 2f, 1.5f, 1.5f, 1.5f };
            table.setWidths(columnWidths);

            // Header Cells
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            for (String header : HEADERS) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
                cell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
                cell.setPadding(5);
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            // Data Cells
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            for (Map<String, Object> rowData : data) {
                for (String key : KEYS) {
                    Object value = rowData.get(key);
                    String textValue = value != null ? value.toString() : "";
                    PdfPCell cell = new PdfPCell(new Phrase(textValue, dataFont));
                    cell.setPadding(4);
                    table.addCell(cell);
                }
            }

            document.add(table);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
