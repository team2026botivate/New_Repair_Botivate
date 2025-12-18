import React, { useState, useEffect } from 'react';
import { Search, X, CheckCircle, Upload, FileText } from 'lucide-react';

// Interface matching WorkTracking task structure
interface WorkTask {
  id: number;
  indentNumber: string;
  machineName: string;
  machineSerialNo: string;
  doerName: string;
  department: string;
  machinePart: string;
  problem: string;
  priority: "High" | "Medium" | "Low";
  expectedDays: number;
  location: string;
  technicianName: string;
  assignedDate: string;
  workNotes: string;
  partsRequired?: string;
  completionStatus?: "Completed" | "Pending" | "In Progress" | "On Hold";
  remarks?: string; // Remarks from WorkTracking
}

// Interface for Inspection Task (extends WorkTask with Inspection details)
interface InspectionTask extends WorkTask {
  inspectedBy: string;
  inspectionDate: string;
  totalCost: string;
  billImage: string; // Placeholder for image name/path
  inspectionRemarks: string;
}

const Inspection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null);

  // Form State
  const [inspectedBy, setInspectedBy] = useState("");
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalCost, setTotalCost] = useState("");
  const [billImage, setBillImage] = useState("");
  const [inspectionRemarks, setInspectionRemarks] = useState("");

  // Data State
  const [workTrackingHistory, setWorkTrackingHistory] = useState<WorkTask[]>([]);
  const [inspectionHistory, setInspectionHistory] = useState<InspectionTask[]>([]);

  // Load data from local storage
  useEffect(() => {
    // Load WorkTracking History (Source for Pending)
    const savedWorkHistory = localStorage.getItem('workTrackingHistory');
    if (savedWorkHistory) {
      setWorkTrackingHistory(JSON.parse(savedWorkHistory));
    }

    // Load Inspection History
    const savedInspectionHistory = localStorage.getItem('inspectionHistory');
    if (savedInspectionHistory) {
      setInspectionHistory(JSON.parse(savedInspectionHistory));
    }
  }, []);

  // Save Inspection History to local storage
  useEffect(() => {
    localStorage.setItem('inspectionHistory', JSON.stringify(inspectionHistory));
  }, [inspectionHistory]);

  // Derive Pending Tasks: Items in WorkTracking History that are NOT in Inspection History
  const pendingTasks = workTrackingHistory.filter(
    (task) => !inspectionHistory.some((inspection) => inspection.id === task.id)
  );

  const handleActionClick = (task: WorkTask) => {
    setSelectedTask(task);
    setInspectedBy("");
    setInspectionDate(new Date().toISOString().split('T')[0]);
    setTotalCost("");
    setBillImage("");
    setInspectionRemarks("");
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedTask || !inspectedBy || !totalCost) return;

    const newInspection: InspectionTask = {
      ...selectedTask,
      inspectedBy,
      inspectionDate,
      totalCost,
      billImage: billImage || "bill_receipt.jpg", // Default mock image if empty
      inspectionRemarks
    };

    setInspectionHistory([newInspection, ...inspectionHistory]);
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const filteredPending = pendingTasks.filter(task => 
    task.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = inspectionHistory.filter(task => 
    task.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inspectorOptions = [
    "Quality Inspector A",
    "Quality Inspector B",
    "Supervisor X",
    "Manager Y"
  ];

  return (
    <div className="h-full flex flex-col">
       {/* Header */}
       <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspection</h1>
          <p className="text-gray-600">Inspect completed maintenance tasks</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search inspections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveSection("pending")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeSection === "pending"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveSection("history")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeSection === "history"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History ({inspectionHistory.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeSection === "pending" ? (
             <div className="min-w-full inline-block align-middle">
               <div className="hidden md:block border rounded-lg overflow-hidden">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Indent Number</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Serial No</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Technician</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Assigned Date</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Work Notes</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Parts Required</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Completion Status</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Remarks</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredPending.map(task => (
                       <tr key={task.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap">
                           <button
                             onClick={() => handleActionClick(task)}
                             className="flex items-center gap-1 px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-xs"
                           >
                             <CheckCircle size={12} />
                             Inspect
                           </button>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{task.indentNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.machineName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.machineSerialNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.department}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.machinePart}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate" title={task.problem}>{task.problem}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.expectedDays} days</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.location}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.technicianName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.assignedDate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.workNotes}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.partsRequired || "-"}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs">
                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                             task.completionStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                           }`}>
                             {task.completionStatus || "Pending"}
                           </span>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.remarks || "-"}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={15} className="px-3 py-8 text-center text-gray-500 text-xs">
                           No pending inspections found
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Card View */}
               <div className="md:hidden space-y-4">
                 {filteredPending.map(task => (
                   <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                     <div className="flex justify-between items-start">
                       <div>
                         <span className="text-sm font-bold text-sky-600 block">{task.indentNumber}</span>
                         <span className="text-xs text-gray-500">{task.machineName}</span>
                       </div>
                       <button
                         onClick={() => handleActionClick(task)}
                         className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs font-medium"
                       >
                         <CheckCircle size={14} />
                         Inspect
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       <div>
                         <span className="text-gray-500 block">Department</span>
                         <span className="font-medium text-gray-900">{task.department}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Status</span>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                           task.completionStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                         }`}>
                           {task.completionStatus || "Pending"}
                         </span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Technician</span>
                         <span className="font-medium text-gray-900">{task.technicianName}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Assigned</span>
                         <span className="font-medium text-gray-900">{task.assignedDate}</span>
                       </div>
                     </div>
                     
                     <div>
                       <span className="text-gray-500 block text-xs">Work Notes</span>
                       <p className="text-xs text-gray-700 mt-1">{task.workNotes}</p>
                     </div>
                   </div>
                 ))}
                 {filteredPending.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No pending inspections found</div>
                 )}
               </div>
             </div>
          ) : (
            // History Section
            <div className="min-w-full inline-block align-middle">
              <div className="hidden md:block border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Indent Number</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Serial No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Technician</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Assigned Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Work Notes</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Parts Required</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Inspected By</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Inspection Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Cost</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill Image</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map(task => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{task.indentNumber}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.machineName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.machineSerialNo}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.department}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.machinePart}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate" title={task.problem}>{task.problem}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.expectedDays} days</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.location}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.technicianName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.assignedDate}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.workNotes}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.partsRequired || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{task.inspectedBy}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.inspectionDate}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">₹{task.totalCost}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-sky-600 cursor-pointer hover:underline">
                          {task.billImage ? (
                            <div className="flex items-center gap-1">
                              <FileText size={12} />
                              View
                            </div>
                          ) : "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{task.inspectionRemarks}</td>
                      </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={17} className="px-3 py-8 text-center text-gray-500 text-xs">
                          No inspection history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredHistory.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-bold text-sky-600 block">{task.indentNumber}</span>
                        <span className="text-xs text-gray-500">{task.machineName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block">Department</span>
                        <span className="font-medium text-gray-900">{task.department}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Inspected By</span>
                        <span className="font-medium text-gray-900">{task.inspectedBy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Date</span>
                        <span className="font-medium text-gray-900">{task.inspectionDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Cost</span>
                        <span className="font-medium text-gray-900">₹{task.totalCost}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500 block text-xs">Remarks</span>
                      <p className="text-xs text-gray-700 mt-1">{task.inspectionRemarks}</p>
                    </div>
                  </div>
                ))}
                {filteredHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-xs">No inspection history found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inspection Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Complete Inspection
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Read-only Details */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md text-xs">
                    <div>
                      <p className="text-gray-500">Indent No</p>
                      <p className="font-medium">{selectedTask.indentNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Machine</p>
                      <p className="font-medium">{selectedTask.machineName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Technician</p>
                      <p className="font-medium">{selectedTask.technicianName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completion</p>
                      <p className="font-medium">{selectedTask.completionStatus}</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Inspected By</label>
                      <select
                        value={inspectedBy}
                        onChange={(e) => setInspectedBy(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs py-1.5"
                      >
                        <option value="">Select Inspector</option>
                        {inspectorOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Inspection Date</label>
                      <input
                        type="date"
                        value={inspectionDate}
                        onChange={(e) => setInspectionDate(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Total Cost (₹)</label>
                      <input
                        type="number"
                        value={totalCost}
                        onChange={(e) => setTotalCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs py-1.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bill Image</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer bg-white border border-gray-300 rounded-md py-1.5 px-3 flex items-center justify-center text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                          <Upload size={14} className="mr-2" />
                          Upload
                          <input type="file" className="hidden" onChange={(e) => setBillImage(e.target.files?.[0]?.name || "")} />
                        </label>
                        {billImage && <span className="text-xs text-green-600 truncate max-w-[80px]">{billImage}</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      value={inspectionRemarks}
                      onChange={(e) => setInspectionRemarks(e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs"
                      placeholder="Enter inspection remarks..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Complete Inspection
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspection;
