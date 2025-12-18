// src/pages/Approval.tsx
import { useState } from "react";
import { CheckCircle, X, Search } from "lucide-react";

interface ApprovalIndent {
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
  status?: "Inhouse" | "Outhouse";
  approvedAt?: string;
}

const Approval = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<ApprovalIndent | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<"Inhouse" | "Outhouse">("Inhouse");
  const [indents, setIndents] = useState<ApprovalIndent[]>([
    // Pending Indents (4 rows)
    {
      id: 1,
      indentNumber: "IN-001",
      machineName: "HP-102",
      machineSerialNo: "HP-SN-2021-102",
      doerName: "Rajesh Kumar",
      department: "Manufacturing",
      machinePart: "Hydraulic Bearing",
      problem: "Unusual noise from hydraulic system during operation",
      priority: "High",
      expectedDays: 3,
      location: "Shop Floor A - Bay 3"
    },
    {
      id: 2,
      indentNumber: "IN-003",
      machineName: "CNC-305",
      machineSerialNo: "CNC-SN-2022-305",
      doerName: "Amit Patel",
      department: "Manufacturing",
      machinePart: "Spindle Motor",
      problem: "Motor overheating after 2 hours of continuous operation",
      priority: "High",
      expectedDays: 2,
      location: "CNC Section - Bay 5"
    },
    {
      id: 3,
      indentNumber: "IN-006",
      machineName: "GRIND-709",
      machineSerialNo: "GRIND-SN-2022-709",
      doerName: "Anil Joshi",
      department: "Manufacturing",
      machinePart: "Grinding Wheel",
      problem: "Wheel vibration affecting surface finish quality",
      priority: "High",
      expectedDays: 2,
      location: "Grinding Section - Bay 2"
    },
    {
      id: 4,
      indentNumber: "IN-008",
      machineName: "PRESS-911",
      machineSerialNo: "PRESS-SN-2020-911",
      doerName: "Rahul Mehta",
      department: "Manufacturing",
      machinePart: "Hydraulic Ram",
      problem: "Slow ram movement affecting production rate",
      priority: "Medium",
      expectedDays: 4,
      location: "Press Shop - Bay 4"
    },
    // History - Inhouse (6 rows)
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
      approvedAt: "22/01/2024 14:30:00"
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
      approvedAt: "21/01/2024 11:15:00"
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
      approvedAt: "19/01/2024 16:45:00"
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
      approvedAt: "18/01/2024 10:20:00"
    },
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
    },
    // History - Outhouse (10 rows)
    {
      id: 11,
      indentNumber: "IN-019",
      machineName: "IM-405",
      machineSerialNo: "IM-SN-2021-405",
      doerName: "Swati Joshi",
      department: "Production",
      machinePart: "Heater Band",
      problem: "Temperature fluctuations during injection molding process",
      priority: "Medium",
      expectedDays: 4,
      location: "Injection Molding - Line 2",
      status: "Outhouse",
      approvedAt: "22/01/2024 09:30:00"
    },
    {
      id: 12,
      indentNumber: "IN-018",
      machineName: "IO-103",
      machineSerialNo: "IO-SN-2019-103",
      doerName: "Alok Pandey",
      department: "Quality Control",
      machinePart: "Encoder",
      problem: "Position feedback errors during automated operations",
      priority: "High",
      expectedDays: 2,
      location: "Inspection Area",
      status: "Outhouse",
      approvedAt: "21/01/2024 15:00:00"
    },
    {
      id: 13,
      indentNumber: "IN-016",
      machineName: "DRILL-810",
      machineSerialNo: "DRILL-SN-2021-810",
      doerName: "Deepak Sharma",
      department: "Production",
      machinePart: "Depth Stop",
      problem: "Inconsistent drilling depth across multiple operations",
      priority: "Low",
      expectedDays: 6,
      location: "Drilling Area - Station 1",
      status: "Outhouse",
      approvedAt: "20/01/2024 14:15:00"
    },
    {
      id: 14,
      indentNumber: "IN-015",
      machineName: "GRIND-709",
      machineSerialNo: "GRIND-SN-2022-709",
      doerName: "Anjali Kapoor",
      department: "Manufacturing",
      machinePart: "Coolant Nozzle",
      problem: "Clogged coolant flow affecting surface finish quality",
      priority: "Medium",
      expectedDays: 2,
      location: "Grinding Section - Bay 2",
      status: "Outhouse",
      approvedAt: "20/01/2024 10:00:00"
    },
    {
      id: 15,
      indentNumber: "IN-013",
      machineName: "LAT-507",
      machineSerialNo: "LAT-SN-2020-507",
      doerName: "Neha Choudhary",
      department: "Production",
      machinePart: "Tail Stock",
      problem: "Misalignment during long shaft turning operations",
      priority: "Medium",
      expectedDays: 4,
      location: "Lathe Section",
      status: "Outhouse",
      approvedAt: "19/01/2024 13:00:00"
    },
    {
      id: 16,
      indentNumber: "IN-012",
      machineName: "CNC-305",
      machineSerialNo: "CNC-SN-2022-305",
      doerName: "Sanjay Gupta",
      department: "Manufacturing",
      machinePart: "Ball Screw",
      problem: "Backlash in X-axis movement affecting precision",
      priority: "High",
      expectedDays: 2,
      location: "CNC Section - Bay 5",
      status: "Outhouse",
      approvedAt: "19/01/2024 09:15:00"
    },
    {
      id: 17,
      indentNumber: "IN-011",
      machineName: "HP-102",
      machineSerialNo: "HP-SN-2021-102",
      doerName: "Kavita Nair",
      department: "Manufacturing",
      machinePart: "Control Panel",
      problem: "Touch screen responsiveness issues affecting operation",
      priority: "Low",
      expectedDays: 5,
      location: "Shop Floor A - Bay 3",
      status: "Outhouse",
      approvedAt: "18/01/2024 16:00:00"
    },
    {
      id: 18,
      indentNumber: "IN-010",
      machineName: "IM-405",
      machineSerialNo: "IM-SN-2021-405",
      doerName: "Arun Mishra",
      department: "Production",
      machinePart: "Injection Nozzle",
      problem: "Material leakage from nozzle tip during operation",
      priority: "Medium",
      expectedDays: 3,
      location: "Injection Molding - Line 2",
      status: "Outhouse",
      approvedAt: "18/01/2024 12:30:00"
    },
    {
      id: 19,
      indentNumber: "IN-007",
      machineName: "DRILL-810",
      machineSerialNo: "DRILL-SN-2021-810",
      doerName: "Sneha Desai",
      department: "Production",
      machinePart: "Drill Chuck",
      problem: "Chuck not holding drill bits properly causing misalignment",
      priority: "Medium",
      expectedDays: 3,
      location: "Drilling Area - Station 1",
      status: "Outhouse",
      approvedAt: "17/01/2024 11:45:00"
    },
    {
      id: 20,
      indentNumber: "IN-005",
      machineName: "MILL-608",
      machineSerialNo: "MILL-SN-2023-608",
      doerName: "Vikram Singh",
      department: "Quality Control",
      machinePart: "Coolant System",
      problem: "Coolant leakage near pump connection",
      priority: "Low",
      expectedDays: 7,
      location: "Milling Area - Station 3",
      status: "Outhouse",
      approvedAt: "16/01/2024 14:00:00"
    }
  ]);

  // Get pending indents (indents without status)
  const pendingIndents = indents.filter(indent => !indent.status);

  // Get history indents (indents with status)
  const historyIndents = indents.filter(indent => indent.status);

  // Filter indents based on search
  const filteredPendingIndents = pendingIndents.filter(indent => 
    indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.doerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistoryIndents = historyIndents.filter(indent => 
    indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.doerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveClick = (indent: ApprovalIndent) => {
    setSelectedIndent(indent);
    setApprovalStatus("Inhouse"); // Default value
    setIsApproveModalOpen(true);
  };

  const handleApproveSubmit = () => {
    if (!selectedIndent) return;

    // Update the indent with status and approval timestamp
    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            status: approvalStatus,
            approvedAt: new Date().toLocaleString('en-GB')
          } 
        : indent
    );

    setIndents(updatedIndents);
    setIsApproveModalOpen(false);
    setSelectedIndent(null);
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
      case "Inhouse": return "bg-sky-100 text-sky-800 border-sky-200";
      case "Outhouse": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Indent Approval</h1>
          <p className="text-gray-600">Manage and approve maintenance indents</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search indents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Section Tabs */}
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
            Pending ({pendingIndents.length})
          </button>
          <button
            onClick={() => setActiveSection("history")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeSection === "history"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History ({historyIndents.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeSection === "pending" ? (
            // Pending Section
            <div className="min-w-full inline-block align-middle">
              {filteredPendingIndents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No pending indents found
                </div>
              ) : (
                <>
                  <div className="hidden md:block border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Action
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Indent Number
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Machine Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Machine Serial No
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Doer Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Department
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Machine Part
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Problem
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Priority
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Expected Days
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Location
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPendingIndents.map((indent) => (
                          <tr key={indent.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap">
                                <button
                                onClick={() => handleApproveClick(indent)}
                                className="flex items-center gap-1 px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-xs"
                              >
                                <CheckCircle size={12} />
                                Approve
                              </button>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                              {indent.indentNumber}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                              {indent.machineName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.machineSerialNo}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                              {indent.doerName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.department}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.machinePart}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">
                              {indent.problem}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                                {indent.priority}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.expectedDays} days
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.location}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredPendingIndents.map((indent) => (
                      <div key={indent.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-sm font-bold text-sky-600 block">{indent.indentNumber}</span>
                            <span className="text-xs text-gray-500">{indent.machineName}</span>
                          </div>
                          <button
                            onClick={() => handleApproveClick(indent)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs font-medium"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500 block">Department</span>
                            <span className="font-medium text-gray-900">{indent.department}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Priority</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                              {indent.priority}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Part</span>
                            <span className="font-medium text-gray-900">{indent.machinePart}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Doer</span>
                            <span className="font-medium text-gray-900">{indent.doerName}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-500 block text-xs">Problem</span>
                          <p className="text-xs text-gray-700 mt-1">{indent.problem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // History Section
            <div className="min-w-full inline-block align-middle">
              {filteredHistoryIndents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No history found
                </div>
              ) : (
                <>
                  <div className="hidden md:block border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Indent Number
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Machine Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Machine Serial No
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Doer Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Department
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Machine Part
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Problem
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Priority
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Expected Days
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Location
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Status
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Approved At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredHistoryIndents.map((indent) => (
                          <tr key={indent.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                              {indent.indentNumber}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                              {indent.machineName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.machineSerialNo}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                              {indent.doerName}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.department}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.machinePart}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">
                              {indent.problem}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                                {indent.priority}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.expectedDays} days
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.location}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(indent.status || '')}`}>
                                {indent.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                              {indent.approvedAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredHistoryIndents.map((indent) => (
                      <div key={indent.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-sm font-bold text-sky-600 block">{indent.indentNumber}</span>
                            <span className="text-xs text-gray-500">{indent.machineName}</span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(indent.status || '')}`}>
                            {indent.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500 block">Department</span>
                            <span className="font-medium text-gray-900">{indent.department}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Priority</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                              {indent.priority}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Part</span>
                            <span className="font-medium text-gray-900">{indent.machinePart}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Approved At</span>
                            <span className="font-medium text-gray-900">{indent.approvedAt}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-500 block text-xs">Problem</span>
                          <p className="text-xs text-gray-700 mt-1">{indent.problem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {isApproveModalOpen && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Approve Indent</h3>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Pre-filled Read-only Fields - Grid Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Indent Number
                  </label>
                  <input
                    type="text"
                    value={selectedIndent.indentNumber}
                    readOnly
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Machine Name
                  </label>
                  <input
                    type="text"
                    value={selectedIndent.machineName}
                    readOnly
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Machine Serial No
                  </label>
                  <input
                    type="text"
                    value={selectedIndent.machineSerialNo}
                    readOnly
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Doer Name
                  </label>
                  <input
                    type="text"
                    value={selectedIndent.doerName}
                    readOnly
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={selectedIndent.department}
                    readOnly
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Machine Part
                  </label>
                  <input
                    type="text"
                    value={selectedIndent.machinePart}
                    readOnly
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Problem
                </label>
                <textarea
                  value={selectedIndent.problem}
                  readOnly
                  rows={2}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs resize-none"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value as "Inhouse" | "Outhouse")}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-transparent text-xs"
                >
                  <option value="Inhouse">Inhouse</option>
                  <option value="Outhouse">Outhouse</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveSubmit}
                className="px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-xs"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;