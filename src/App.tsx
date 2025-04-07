import React, { useState, ChangeEvent } from 'react';
import { ORUData } from './types';

const App: React.FC = () => {
  const [oruDataFile, setOruDataFile] = useState<File | null>(null);
  const [resultData, setResultData] = useState<ORUData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(process.env.REACT_APP_BACKEND_URL);
    const file = e.target.files?.[0];
    if (file) {
      setOruDataFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!oruDataFile) return;

    const formData = new FormData();
    formData.append('oruFile', oruDataFile); // Match backend field name

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}upload-oru`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data: ORUData[] = await response.json();
      setResultData(data);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">ORU Data High Risk Table</h1>

        <input
          type="file"
          onChange={handleFileChange}
          className="block mb-4 w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow mb-6"
        >
          Send ORU File
        </button>

        {loading && <p className="text-gray-600">Loading...</p>}

        {resultData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Msg No.</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Id</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Gender</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Dob</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Detail</th>
                </tr>
              </thead>
              <tbody>
                {resultData.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      item.highRisk.result ? 'bg-red-100' : 'bg-green-100'
                    }
                  >
                    <td className="border px-4 py-2 text-sm text-gray-800">{item.msg_no}</td>
                    <td className="border px-4 py-2 text-sm text-gray-800">{item.id}</td>
                    <td className="border px-4 py-2 text-sm text-gray-800">{item.name}</td>
                    <td className="border px-4 py-2 text-sm text-gray-800">{item.gender}</td>
                    <td className="border px-4 py-2 text-sm text-gray-800">{item.dob}</td>
                    <td className="border px-4 py-2 text-sm text-gray-800">{item.highRisk.result ? 'Risk' : 'Normal' }</td>
                    <td className="border px-4 py-2 text-sm text-gray-800">
                      {item.highRisk.detail.length > 0
                        ? item.highRisk.detail.join(', ')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
