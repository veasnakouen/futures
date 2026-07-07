import React, { useState } from "react";
import {Modal, ModalHeader, ModalBody, Button, TextInput, Select, Label, FileInput} from "@/lib/flowbite-compat";
import api from "../../../../services/api";

interface Props {
  show: boolean;
  onClose: () => void;
  onSourceAdded: () => void;
}

export default function DataSourceManagerModal({ show, onClose, onSourceAdded }: Props) {
  const [activeTab, setActiveTab] = useState<"csv" | "jdbc">("csv");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CSV State
  const [csvName, setCsvName] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // JDBC State
  const [jdbcName, setJdbcName] = useState("");
  const [jdbcUrl, setJdbcUrl] = useState("jdbc:sqlserver://host:1433;databaseName=MyDB;encrypt=true;trustServerCertificate=true;");
  const [jdbcUsername, setJdbcUsername] = useState("");
  const [jdbcPassword, setJdbcPassword] = useState("");
  const [jdbcTable, setJdbcTable] = useState("");
  const [jdbcColumns, setJdbcColumns] = useState("");
  const [fetchedColumns, setFetchedColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [fetchedTables, setFetchedTables] = useState<string[]>([]);

  const handleUploadCsv = async () => {
    if (!csvName || !csvFile) {
      setError("Please provide a name and select a CSV file.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", csvName);
      formData.append("file", csvFile);
      await api.post("/report-builder/data-integration/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV uploaded and dynamic table created successfully!");
      onSourceAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTables = async () => {
    if (!jdbcUrl) {
      setError("Please provide JDBC URL to fetch tables.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/report-builder/data-integration/fetch-tables", {
        jdbcUrl,
        username: jdbcUsername,
        password: jdbcPassword,
      });
      setFetchedTables(res.data);
      if (res.data.length > 0) {
        setJdbcTable(res.data[0]); // auto select first table
      }
      setFetchedColumns([]); // clear columns when tables are fetched
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch tables from external database");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchColumns = async () => {
    if (!jdbcUrl || !jdbcTable) {
      setError("Please provide JDBC URL and Target Table Name to fetch columns.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/report-builder/data-integration/fetch-columns", {
        jdbcUrl,
        username: jdbcUsername,
        password: jdbcPassword,
        tableName: jdbcTable,
      });
      setFetchedColumns(res.data);
      // Auto-select all by default to make it easy
      setSelectedColumns(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch columns from external database");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectJdbc = async () => {
    const finalColumns = fetchedColumns.length > 0 ? selectedColumns.join(",") : jdbcColumns;
    if (!jdbcName || !jdbcUrl || !jdbcTable || !finalColumns) {
      setError("Please fill in all required JDBC fields and select at least one column.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/report-builder/data-integration/external-jdbc", {
        name: jdbcName,
        jdbcUrl,
        username: jdbcUsername,
        password: jdbcPassword,
        tableName: jdbcTable,
        columns: finalColumns.split(",").map((c) => c.trim()).filter(Boolean),
      });
      alert("External Database configured successfully!");
      onSourceAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to configure External Database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="2xl">
      <ModalHeader>Manage External Data Sources</ModalHeader>
      <ModalBody>
        <div className="flex space-x-4 mb-4 border-b pb-2">
          <button
            className={`font-bold ${activeTab ==="csv"?"text-blue-600 border-b-2 border-blue-600":"text-gray-500"}`}
            onClick={() => setActiveTab("csv")}
          >
            Upload CSV/Excel
          </button>
          <button
            className={`font-bold ${activeTab ==="jdbc"?"text-blue-600 border-b-2 border-blue-600":"text-gray-500"}`}
            onClick={() => setActiveTab("jdbc")}
          >
            Connect External Database
          </button>
        </div>

        {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded text-sm font-semibold">{error}</div>}

        {activeTab === "csv" && (
          <div className="flex flex-col gap-4">
            <div>
              <Label>Data Source Name</Label>
              <TextInput placeholder="e.g. Q3 Sales Data" value={csvName} onChange={(e) => setCsvName(e.target.value)} />
            </div>
            <div>
              <Label>Select CSV File</Label>
              <FileInput accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Uploading a CSV will dynamically create a new table in the database and import all rows so it can be queried using standard SQL aggregations.
            </p>
            <Button color="success" onClick={handleUploadCsv} isProcessing={loading}>
              Upload and Create Source
            </Button>
          </div>
        )}

        {activeTab === "jdbc" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data Source Name</Label>
                <TextInput placeholder="e.g. Remote HR DB" value={jdbcName} onChange={(e) => setJdbcName(e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Target Table Name</Label>
                  <Button size="xs" color="light" onClick={handleFetchTables} disabled={loading || !jdbcUrl}>
                    {loading ? "Fetching..." : "Fetch Tables"}
                  </Button>
                </div>
                {fetchedTables.length > 0 ? (
                  <Select value={jdbcTable} onChange={(e) => {
                    setJdbcTable(e.target.value);
                    setFetchedColumns([]); // clear columns if table changes
                  }}>
                    {fetchedTables.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                ) : (
                  <TextInput placeholder="e.g. Remote_Employees (or click Fetch Tables)" value={jdbcTable} onChange={(e) => setJdbcTable(e.target.value)} />
                )}
              </div>
            </div>
            <div>
              <Label>JDBC URL</Label>
              <TextInput value={jdbcUrl} onChange={(e) => setJdbcUrl(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Username</Label>
                <TextInput value={jdbcUsername} onChange={(e) => setJdbcUsername(e.target.value)} />
              </div>
              <div>
                <Label>Password</Label>
                <TextInput type="password" value={jdbcPassword} onChange={(e) => setJdbcPassword(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Available Columns</Label>
                <Button size="xs" color="light" onClick={handleFetchColumns} disabled={loading || !jdbcUrl || !jdbcTable}>
                  {loading ? "Fetching..." : "Fetch Columns"}
                </Button>
              </div>
              {fetchedColumns.length > 0 ? (
                <div className="max-h-40 overflow-y-auto rounded p-3 bg-white flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm font-semibold border-b pb-2 mb-1">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded"
                      checked={selectedColumns.length === fetchedColumns.length}
                      onChange={(e) => setSelectedColumns(e.target.checked ? [...fetchedColumns] : [])}
                    />
                    Select All
                  </label>
                  {fetchedColumns.map(col => (
                    <label key={col} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded"
                        checked={selectedColumns.includes(col)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedColumns([...selectedColumns, col]);
                          else setSelectedColumns(selectedColumns.filter(c => c !== col));
                        }}
                      />
                      {col}
                    </label>
                  ))}
                </div>
              ) : (
                <TextInput placeholder="id, name, department, salary (or click Fetch Columns)" value={jdbcColumns} onChange={(e) => setJdbcColumns(e.target.value)} />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              The query builder will establish a dynamic JdbcTemplate to forward your aggregations and filters to this external database.
            </p>
            <Button color="success" onClick={handleConnectJdbc} isProcessing={loading}>
              Connect and Create Source
            </Button>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
