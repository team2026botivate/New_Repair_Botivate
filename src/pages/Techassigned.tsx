import React, { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';

interface TechTask {
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
  status: "Inhouse";
  approvedAt: string;
  // New fields for assignment
  technicianName?: string;
  assignedDate?: string;
  workNotes?: string;
}

const TechAssigned: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TechTask | null>(null);

  // Form State
  const [technicianName, setTechnicianName] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [workNotes, setWorkNotes] = useState("");

  // Mock Data - Inhouse items from Approval.tsx
  // Items 5, 6, 7, 8 have been moved to history to demonstrate the flow
  const [pendingTasks, setPendingTasks] = useState<TechTask[]>([
    {
      id: 9,
      indentNumber: "IN-004",
      machineName: "LAT-507",
      machineSerialNo: "LAT-SN-2020-507",
      doerName: "Sunita Verma",
      department: "Production",
      machinePart: "Tool Turret",
      problem: "Tool changing mechanism stuck at position 4",
      priority: "Medium",
      expectedDays: 4,
      location: "Lathe Section",
      status: "Inhouse",
      approvedAt: "16/01/2024 10:30:00"
    },
    {
      id: 10,
      indentNumber: "IN-002",
      machineName: "CB-201",
      machineSerialNo: "CB-SN-2020-201",
      doerName: "Priya Sharma",
      department: "Production",
      machinePart: "Conveyor Belt",
      problem: "Belt slipping and causing production delays",
      priority: "Medium",
      expectedDays: 5,
      location: "Assembly Line 2",
      status: "Inhouse",
      approvedAt: "15/01/2024 12:45:00"
    }
  ]);

  const [historyTasks, setHistoryTasks] = useState<TechTask[]>([
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
      status: "Inhouse",
      approvedAt: "22/01/2024 14:30:00",
      technicianName: "Rajesh Kumar",
      assignedDate: "2024-01-23",
      workNotes: "Motor replaced and tested."
    },
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
      status: "Inhouse",
      approvedAt: "21/01/2024 11:15:00",
      technicianName: "Amit Patel",
      assignedDate: "2024-01-22",
      workNotes: "Gauge calibrated."
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
      status: "Inhouse",
      approvedAt: "19/01/2024 16:45:00",
      technicianName: "Suresh Singh",
      assignedDate: "2024-01-20",
      workNotes: "Bearings replaced and aligned."
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
      status: "Inhouse",
      approvedAt: "18/01/2024 10:20:00",
      technicianName: "Vikram Malhotra",
      assignedDate: "2024-01-19",
      workNotes: "Sensors recalibrated and tested."
    }
  ]);

  const technicians = [
    "Rajesh Kumar",
    "Amit Patel",
    "Suresh Singh",
    "Vikram Malhotra",
    "Anita Desai"
  ];

  const handleAssignClick = (task: TechTask) => {
    setSelectedTask(task);
    setTechnicianName("");
    setAssignedDate(new Date().toISOString().split('T')[0]);
    setWorkNotes("");
    setIsModalOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!selectedTask || !technicianName || !assignedDate) return;

    const updatedTask: TechTask = {
      ...selectedTask,
      technicianName,
      assignedDate,
      workNotes
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
          <h1 className="text-2xl font-bold text-gray-900">Tech Assigned</h1>
          <p className="text-gray-600">Assign technicians to approved inhouse indents</p>
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
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredPending.map(task => (
                       <tr key={task.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap">
                           <button
                             onClick={() => handleAssignClick(task)}
                             className="flex items-center gap-1 px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-xs"
                           >
                             <UserPlus size={12} />
                             Assign
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
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={11} className="px-3 py-8 text-center text-gray-500 text-xs">No pending tasks found</td>
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
                         onClick={() => handleAssignClick(task)}
                         className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs font-medium"
                       >
                         <UserPlus size={14} />
                         Assign
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
                         <span className="text-gray-500 block">Part</span>
                         <span className="font-medium text-gray-900">{task.machinePart}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Doer</span>
                         <span className="font-medium text-gray-900">{task.doerName}</span>
                       </div>
                     </div>
                     
                     <div>
                       <span className="text-gray-500 block text-xs">Problem</span>
                       <p className="text-xs text-gray-700 mt-1">{task.problem}</p>
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
                     {filteredHistory.map(task => (
                       <tr key={task.id} className="hover:bg-gray-50">
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
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={13} className="px-3 py-8 text-center text-gray-500 text-xs">No history found</td>
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
                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                         {task.priority}
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
                       <span className="text-gray-500 block text-xs">Work Notes</span>
                       <p className="text-xs text-gray-700 mt-1">{task.workNotes}</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Assign Technician</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Read Only Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Indent No</label>
                  <div className="font-medium">{selectedTask.indentNumber}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Machine</label>
                  <div className="font-medium">{selectedTask.machineName}</div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technician Name *</label>
                <select
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date *</label>
                <input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Notes</label>
                <textarea
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Enter initial instructions or notes..."
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
                onClick={handleAssignSubmit}
                disabled={!technicianName || !assignedDate}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechAssigned;