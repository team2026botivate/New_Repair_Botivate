import React, { useState, useEffect } from 'react';
import { Search, Edit, X } from 'lucide-react';

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
  // New fields for work tracking
  partsRequired?: string;
  completionStatus?: "Completed" | "Pending" | "In Progress" | "On Hold";
  remarks?: string;
}

const WorkTracking: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null);

  // Form State
  const [partsRequired, setPartsRequired] = useState("");
  const [completionStatus, setCompletionStatus] = useState<"Completed" | "Pending" | "In Progress" | "On Hold">("In Progress");
  const [remarks, setRemarks] = useState("");

  // Mock Data - Initialized with data that represents "History" from Techassigned.tsx
  const [pendingTasks, setPendingTasks] = useState<WorkTask[]>([
    {
      id: 5,
      indentNumber: "IN-020",
      machineName: "CB-201",
      machineSerialNo: "CB-SN-2020-201",
      doerName: "Ravi Shankar",
      department: "Manufacturing",
      machinePart: "Drive Motor",
      problem: "Overheating during continuous operation cycles",
      priority: "High",
      expectedDays: 1,
      location: "Assembly Line 2",
      technicianName: "Rajesh Kumar",
      assignedDate: "2024-01-23",
      workNotes: "Motor replaced and tested."
    }
  ]);

  // Load history from local storage if available, otherwise use mock data
  const [historyTasks, setHistoryTasks] = useState<WorkTask[]>(() => {
    const saved = localStorage.getItem('workTrackingHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    
    return [
      {
        id: 6,
        indentNumber: "IN-017",
        machineName: "PRESS-911",
        machineSerialNo: "PRESS-SN-2020-911",
        doerName: "Meera Reddy",
        department: "Manufacturing",
        machinePart: "Pressure Gauge",
        problem: "Inaccurate pressure readings affecting product quality",
        priority: "Medium",
        expectedDays: 3,
        location: "Press Shop - Bay 4",
        technicianName: "Amit Patel",
        assignedDate: "2024-01-22",
        workNotes: "Gauge calibrated.",
        partsRequired: "New Gauge Dial",
        completionStatus: "Completed",
        remarks: "Calibration successful, tested within limits."
      },
      {
        id: 7,
        indentNumber: "IN-014",
        machineName: "MILL-608",
        machineSerialNo: "MILL-SN-2023-608",
        doerName: "Rohan Iyer",
        department: "Quality Control",
        machinePart: "Spindle Bearings",
        problem: "Excessive play in spindle rotation causing vibration",
        priority: "High",
        expectedDays: 3,
        location: "Milling Area - Station 3",
        technicianName: "Suresh Singh",
        assignedDate: "2024-01-20",
        workNotes: "Bearings replaced and aligned.",
        partsRequired: "SKF 6205 Bearings",
        completionStatus: "Completed",
        remarks: "Bearings replaced, vibration levels normal."
      },
      {
        id: 8,
        indentNumber: "IN-009",
        machineName: "IO-103",
        machineSerialNo: "IO-SN-2019-103",
        doerName: "Pooja Yadav",
        department: "Quality Control",
        machinePart: "Sensor Array",
        problem: "Inaccurate readings from proximity sensors",
        priority: "High",
        expectedDays: 1,
        location: "Inspection Area",
        technicianName: "Vikram Malhotra",
        assignedDate: "2024-01-19",
        workNotes: "Sensors recalibrated and tested.",
        partsRequired: "None",
        completionStatus: "Completed",
        remarks: "Recalibration done, no parts needed."
      }
    ];
  });

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('workTrackingHistory', JSON.stringify(historyTasks));
  }, [historyTasks]);

  const handleActionClick = (task: WorkTask) => {
    setSelectedTask(task);
    setPartsRequired("");
    setCompletionStatus("In Progress");
    setRemarks("");
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!selectedTask) return;

    const updatedTask: WorkTask = {
      ...selectedTask,
      partsRequired,
      completionStatus,
      remarks
    };

    setHistoryTasks([updatedTask, ...historyTasks]);
    setPendingTasks(pendingTasks.filter(t => t.id !== selectedTask.id));
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress": return "bg-sky-100 text-sky-800 border-sky-200";
      case "On Hold": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredPending = pendingTasks.filter(task => 
    task.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = historyTasks.filter(task => 
    task.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
       {/* Header */}
       <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Tracking</h1>
          <p className="text-gray-600">Track status of assigned maintenance tasks</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
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
            History ({historyTasks.length})
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Doer Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Technician</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Assigned Date</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Work Notes</th>
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
                             <Edit size={12} />
                             Update
                           </button>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{task.indentNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{task.machineName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.machineSerialNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{task.doerName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.department}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.machinePart}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{task.problem}</td>
                         <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.expectedDays} days</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.location}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{task.technicianName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.assignedDate}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{task.workNotes}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={14} className="px-3 py-8 text-center text-gray-500 text-xs">No pending tasks found</td>
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
                         <Edit size={14} />
                         Update
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       <div>
                         <span className="text-gray-500 block">Department</span>
                         <span className="font-medium text-gray-900">{task.department}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Priority</span>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                           {task.priority}
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
                   <div className="text-center py-8 text-gray-500 text-xs">No pending tasks found</div>
                 )}
               </div>
             </div>
          ) : (
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Completion Status</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Remarks</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredHistory.map(task => (
                       <tr key={task.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{task.indentNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{task.machineName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.machineSerialNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.department}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.machinePart}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{task.problem}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.expectedDays} days</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.location}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{task.technicianName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{task.assignedDate}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{task.workNotes}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{task.partsRequired}</td>
                         <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.completionStatus || '')}`}>
                              {task.completionStatus}
                            </span>
                         </td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{task.remarks}</td>
                       </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={14} className="px-3 py-8 text-center text-gray-500 text-xs">No history found</td>
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
                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.completionStatus || '')}`}>
                         {task.completionStatus}
                       </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       <div>
                         <span className="text-gray-500 block">Department</span>
                         <span className="font-medium text-gray-900">{task.department}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Technician</span>
                         <span className="font-medium text-gray-900">{task.technicianName}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Assigned</span>
                         <span className="font-medium text-gray-900">{task.assignedDate}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Part</span>
                         <span className="font-medium text-gray-900">{task.machinePart}</span>
                       </div>
                     </div>
                     
                     <div>
                       <span className="text-gray-500 block text-xs">Remarks</span>
                       <p className="text-xs text-gray-700 mt-1">{task.remarks}</p>
                     </div>
                   </div>
                 ))}
                 {filteredHistory.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No history found</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Update Work Status</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Read Only Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Indent No</label>
                  <div className="font-medium text-sm">{selectedTask.indentNumber}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Machine</label>
                  <div className="font-medium text-sm">{selectedTask.machineName}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Technician</label>
                  <div className="font-medium text-sm">{selectedTask.technicianName}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Assigned</label>
                  <div className="font-medium text-sm">{selectedTask.assignedDate}</div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parts Required</label>
                <input
                  type="text"
                  value={partsRequired}
                  onChange={(e) => setPartsRequired(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter parts needed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Status *</label>
                <select
                  value={completionStatus}
                  onChange={(e) => setCompletionStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Enter remarks..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTracking;