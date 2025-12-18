// src/pages/Indent.tsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import type { Indent } from "../models/types";
import IndentForm from "./Forms/IndentForm";

const Indent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [indents, setIndents] = useState<Indent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [editingIndentId, setEditingIndentId] = useState<number | null>(null);
  const [editedIndent, setEditedIndent] = useState<Partial<Indent> | null>(null);

  // Load indents from localStorage on component mount
  useEffect(() => {
    const savedIndents = localStorage.getItem('indents');

    if (savedIndents && savedIndents !== "[]" && savedIndents !== "null") {
      try {
        const parsedIndents = JSON.parse(savedIndents);
        if (Array.isArray(parsedIndents) && parsedIndents.length > 0) {
          // Sort by ID in descending order to show newest first
          const sortedIndents = parsedIndents.sort((a, b) => b.id - a.id);
          setIndents(sortedIndents);
        } else {
          addInitialDummyData();
        }
      } catch (error) {
        addInitialDummyData();
      }
    } else {
      addInitialDummyData();
    }
    
    setIsLoading(false);
  }, []);

  // Save indents to localStorage whenever indents change
  useEffect(() => {
    if (!isLoading && indents.length > 0) {
      localStorage.setItem('indents', JSON.stringify(indents));
    }
  }, [indents, isLoading]);

  // Generate indent number IN-001, IN-002, etc.
  const generateIndentNumber = () => {
    if (indents.length === 0) return "IN-001";
    
    const numbers = indents
      .map(indent => {
        const match = indent.indentNumber.match(/IN-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => !isNaN(num));
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    return `IN-${nextNumber.toString().padStart(3, '0')}`;
  };

  // Add initial dummy data with 20 rows - sorted by ID in descending order
  const addInitialDummyData = () => {
    const dummyIndents: Indent[] = [
      {
        id: 20,
        timestamp: "22/01/2024 12:30:00",
        indentNumber: "IN-020",
        machineName: "CB-201",
        machineSerialNo: "CB-SN-2020-201",
        doerName: "Ravi Shankar",
        department: "Manufacturing",
        machinePartName: "Drive Motor",
        problem: "Overheating during continuous operation cycles",
        priority: "High",
        expectedDeliveryDays: 1,
        location: "Assembly Line 2",
        taskStatus: "Completed",
        image: "/path/to/default.jpg",
        remarks: "Motor replaced and tested",
        soundOfMachine: "Smooth operation",
        temperature: "45°C",
        maintenanceCost: 0,
      },
      {
        id: 19,
        timestamp: "22/01/2024 08:50:00",
        indentNumber: "IN-019",
        machineName: "IM-405",
        machineSerialNo: "IM-SN-2021-405",
        doerName: "Swati Joshi",
        department: "Production",
        machinePartName: "Heater Band",
        problem: "Temperature fluctuations during injection molding process",
        priority: "Medium",
        expectedDeliveryDays: 4,
        location: "Injection Molding - Line 2",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Thermal calibration needed",
        soundOfMachine: "Normal",
        temperature: "60°C",
        maintenanceCost: 0,
      },
      {
        id: 18,
        timestamp: "21/01/2024 14:20:00",
        indentNumber: "IN-018",
        machineName: "IO-103",
        machineSerialNo: "IO-SN-2019-103",
        doerName: "Alok Pandey",
        department: "Quality Control",
        machinePartName: "Encoder",
        problem: "Position feedback errors during automated operations",
        priority: "High",
        expectedDeliveryDays: 2,
        location: "Inspection Area",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Encoder replacement ongoing",
        soundOfMachine: "Intermittent beeping",
        temperature: "32°C",
        maintenanceCost: 0,
      },
      {
        id: 17,
        timestamp: "21/01/2024 10:00:00",
        indentNumber: "IN-017",
        machineName: "PRESS-911",
        machineSerialNo: "PRESS-SN-2020-911",
        doerName: "Meera Reddy",
        department: "Manufacturing",
        machinePartName: "Pressure Gauge",
        problem: "Inaccurate pressure readings affecting product quality",
        priority: "Medium",
        expectedDeliveryDays: 3,
        location: "Press Shop - Bay 4",
        taskStatus: "Completed",
        image: "/path/to/default.jpg",
        remarks: "Gauge calibrated successfully",
        soundOfMachine: "Normal",
        temperature: "42°C",
        maintenanceCost: 0,
      },
      {
        id: 16,
        timestamp: "20/01/2024 13:45:00",
        indentNumber: "IN-016",
        machineName: "DRILL-810",
        machineSerialNo: "DRILL-SN-2021-810",
        doerName: "Deepak Sharma",
        department: "Production",
        machinePartName: "Depth Stop",
        problem: "Inconsistent drilling depth across multiple operations",
        priority: "Low",
        expectedDeliveryDays: 6,
        location: "Drilling Area - Station 1",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Mechanical adjustment needed",
        soundOfMachine: "Normal",
        temperature: "36°C",
        maintenanceCost: 0,
      },
      {
        id: 15,
        timestamp: "20/01/2024 09:30:00",
        indentNumber: "IN-015",
        machineName: "GRIND-709",
        machineSerialNo: "GRIND-SN-2022-709",
        doerName: "Anjali Kapoor",
        department: "Manufacturing",
        machinePartName: "Coolant Nozzle",
        problem: "Clogged coolant flow affecting surface finish quality",
        priority: "Medium",
        expectedDeliveryDays: 2,
        location: "Grinding Section - Bay 2",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Cleaning in progress",
        soundOfMachine: "Normal",
        temperature: "45°C",
        maintenanceCost: 0,
      },
      {
        id: 14,
        timestamp: "19/01/2024 16:05:00",
        indentNumber: "IN-014",
        machineName: "MILL-608",
        machineSerialNo: "MILL-SN-2023-608",
        doerName: "Rohan Iyer",
        department: "Quality Control",
        machinePartName: "Spindle Bearings",
        problem: "Excessive play in spindle rotation causing vibration",
        priority: "High",
        expectedDeliveryDays: 3,
        location: "Milling Area - Station 3",
        taskStatus: "Completed",
        image: "/path/to/default.jpg",
        remarks: "Bearings replaced successfully",
        soundOfMachine: "Smooth operation",
        temperature: "38°C",
        maintenanceCost: 0,
      },
      {
        id: 13,
        timestamp: "19/01/2024 12:10:00",
        indentNumber: "IN-013",
        machineName: "LAT-507",
        machineSerialNo: "LAT-SN-2020-507",
        doerName: "Neha Choudhary",
        department: "Production",
        machinePartName: "Tail Stock",
        problem: "Misalignment during long shaft turning operations",
        priority: "Medium",
        expectedDeliveryDays: 4,
        location: "Lathe Section",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Alignment in progress",
        soundOfMachine: "Grinding noise",
        temperature: "40°C",
        maintenanceCost: 0,
      },
      {
        id: 12,
        timestamp: "19/01/2024 08:45:00",
        indentNumber: "IN-012",
        machineName: "CNC-305",
        machineSerialNo: "CNC-SN-2022-305",
        doerName: "Sanjay Gupta",
        department: "Manufacturing",
        machinePartName: "Ball Screw",
        problem: "Backlash in X-axis movement affecting precision",
        priority: "High",
        expectedDeliveryDays: 2,
        location: "CNC Section - Bay 5",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Critical for precision work",
        soundOfMachine: "Rattling noise",
        temperature: "48°C",
        maintenanceCost: 0,
      },
      {
        id: 11,
        timestamp: "18/01/2024 15:20:00",
        indentNumber: "IN-011",
        machineName: "HP-102",
        machineSerialNo: "HP-SN-2021-102",
        doerName: "Kavita Nair",
        department: "Manufacturing",
        machinePartName: "Control Panel",
        problem: "Touch screen responsiveness issues affecting operation",
        priority: "Low",
        expectedDeliveryDays: 5,
        location: "Shop Floor A - Bay 3",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Software update required",
        soundOfMachine: "Normal",
        temperature: "35°C",
        maintenanceCost: 0,
      },
      {
        id: 10,
        timestamp: "18/01/2024 11:30:00",
        indentNumber: "IN-010",
        machineName: "IM-405",
        machineSerialNo: "IM-SN-2021-405",
        doerName: "Arun Mishra",
        department: "Production",
        machinePartName: "Injection Nozzle",
        problem: "Material leakage from nozzle tip during operation",
        priority: "Medium",
        expectedDeliveryDays: 3,
        location: "Injection Molding - Line 2",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Seal replacement needed",
        soundOfMachine: "Leakage sound",
        temperature: "55°C",
        maintenanceCost: 0,
      },
      {
        id: 9,
        timestamp: "18/01/2024 09:15:00",
        indentNumber: "IN-009",
        machineName: "IO-103",
        machineSerialNo: "IO-SN-2019-103",
        doerName: "Pooja Yadav",
        department: "Quality Control",
        machinePartName: "Sensor Array",
        problem: "Inaccurate readings from proximity sensors",
        priority: "High",
        expectedDeliveryDays: 1,
        location: "Inspection Area",
        taskStatus: "Completed",
        image: "/path/to/default.jpg",
        remarks: "Calibration completed",
        soundOfMachine: "Normal",
        temperature: "30°C",
        maintenanceCost: 0,
      },
      {
        id: 8,
        timestamp: "17/01/2024 14:30:00",
        indentNumber: "IN-008",
        machineName: "PRESS-911",
        machineSerialNo: "PRESS-SN-2020-911",
        doerName: "Rahul Mehta",
        department: "Manufacturing",
        machinePartName: "Hydraulic Ram",
        problem: "Slow ram movement affecting production rate",
        priority: "Medium",
        expectedDeliveryDays: 4,
        location: "Press Shop - Bay 4",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Scheduled maintenance",
        soundOfMachine: "Slow operation",
        temperature: "42°C",
        maintenanceCost: 0,
      },
      {
        id: 7,
        timestamp: "17/01/2024 10:45:00",
        indentNumber: "IN-007",
        machineName: "DRILL-810",
        machineSerialNo: "DRILL-SN-2021-810",
        doerName: "Sneha Desai",
        department: "Production",
        machinePartName: "Drill Chuck",
        problem: "Chuck not holding drill bits properly causing misalignment",
        priority: "Medium",
        expectedDeliveryDays: 3,
        location: "Drilling Area - Station 1",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Under repair",
        soundOfMachine: "Slipping sound",
        temperature: "38°C",
        maintenanceCost: 0,
      },
      {
        id: 6,
        timestamp: "17/01/2024 08:20:00",
        indentNumber: "IN-006",
        machineName: "GRIND-709",
        machineSerialNo: "GRIND-SN-2022-709",
        doerName: "Anil Joshi",
        department: "Manufacturing",
        machinePartName: "Grinding Wheel",
        problem: "Wheel vibration affecting surface finish quality",
        priority: "High",
        expectedDeliveryDays: 2,
        location: "Grinding Section - Bay 2",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Need immediate attention",
        soundOfMachine: "Vibrating noise",
        temperature: "50°C",
        maintenanceCost: 0,
      },
      {
        id: 5,
        timestamp: "16/01/2024 13:10:00",
        indentNumber: "IN-005",
        machineName: "MILL-608",
        machineSerialNo: "MILL-SN-2023-608",
        doerName: "Vikram Singh",
        department: "Quality Control",
        machinePartName: "Coolant System",
        problem: "Coolant leakage near pump connection",
        priority: "Low",
        expectedDeliveryDays: 7,
        location: "Milling Area - Station 3",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Minor repair needed",
        soundOfMachine: "Pump noise",
        temperature: "40°C",
        maintenanceCost: 0,
      },
      {
        id: 4,
        timestamp: "16/01/2024 09:45:00",
        indentNumber: "IN-004",
        machineName: "LAT-507",
        machineSerialNo: "LAT-SN-2020-507",
        doerName: "Sunita Verma",
        department: "Production",
        machinePartName: "Tool Turret",
        problem: "Tool changing mechanism stuck at position 4",
        priority: "Medium",
        expectedDeliveryDays: 4,
        location: "Lathe Section",
        taskStatus: "Completed",
        image: "/path/to/default.jpg",
        remarks: "Issue resolved",
        soundOfMachine: "Normal operation",
        temperature: "35°C",
        maintenanceCost: 0,
      },
      {
        id: 3,
        timestamp: "15/01/2024 14:20:00",
        indentNumber: "IN-003",
        machineName: "CNC-305",
        machineSerialNo: "CNC-SN-2022-305",
        doerName: "Amit Patel",
        department: "Manufacturing",
        machinePartName: "Spindle Motor",
        problem: "Motor overheating after 2 hours of continuous operation",
        priority: "High",
        expectedDeliveryDays: 2,
        location: "CNC Section - Bay 5",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Urgent attention required",
        soundOfMachine: "Motor humming loudly",
        temperature: "75°C",
        maintenanceCost: 0,
      },
      {
        id: 2,
        timestamp: "15/01/2024 11:15:00",
        indentNumber: "IN-002",
        machineName: "CB-201",
        machineSerialNo: "CB-SN-2020-201",
        doerName: "Priya Sharma",
        department: "Production",
        machinePartName: "Conveyor Belt",
        problem: "Belt slipping and causing production delays",
        priority: "Medium",
        expectedDeliveryDays: 5,
        location: "Assembly Line 2",
        taskStatus: "In Progress",
        image: "/path/to/default.jpg",
        remarks: "Under maintenance",
        soundOfMachine: "Belt slipping sound",
        temperature: "45°C",
        maintenanceCost: 0,
      },
      {
        id: 1,
        timestamp: "15/01/2024 10:30:00",
        indentNumber: "IN-001",
        machineName: "HP-102",
        machineSerialNo: "HP-SN-2021-102",
        doerName: "Rajesh Kumar",
        department: "Manufacturing",
        machinePartName: "Hydraulic Bearing",
        problem: "Unusual noise from hydraulic system during operation",
        priority: "High",
        expectedDeliveryDays: 3,
        location: "Shop Floor A - Bay 3",
        taskStatus: "Pending",
        image: "/path/to/default.jpg",
        remarks: "Newly added indent",
        soundOfMachine: "Awaiting inspection",
        temperature: "N/A",
        maintenanceCost: 0,
      }
    ];
    
    // Sort by ID in descending order (newest first)
    const sortedDummyData = dummyIndents.sort((a, b) => b.id - a.id);
    setIndents(sortedDummyData);
  };

  const handleAddIndent = (newIndent: Omit<Indent, 'id' | 'indentNumber'>) => {
    const indentWithNumber: Indent = {
      ...newIndent,
      id: Date.now(), // This ensures new rows have higher IDs
      indentNumber: generateIndentNumber(),
    };
    // Add new indent to the beginning of the array
    const updatedIndents = [indentWithNumber, ...indents];
    setIndents(updatedIndents);
  };

  const handleDeleteIndent = (id: number) => {
    if (window.confirm("Are you sure you want to delete this indent?")) {
      const updatedIndents = indents.filter(indent => indent.id !== id);
      setIndents(updatedIndents);
    }
  };

  const handleEditIndent = (indent: Indent) => {
    setEditingIndentId(indent.id);
    setEditedIndent({ ...indent });
  };
  
  const handleCancelEdit = () => {
    setEditingIndentId(null);
    setEditedIndent(null);
  };
  
  const handleSaveEdit = () => {
    if (!editedIndent || !editingIndentId) return;

    const updatedIndents = indents.map(indent =>
      indent.id === editingIndentId ? { ...indent, ...editedIndent } as Indent : indent
    );
    setIndents(updatedIndents);
    setEditingIndentId(null);
    setEditedIndent(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedIndent) return;
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === 'expectedDeliveryDays') {
      setEditedIndent({ ...editedIndent, [name]: parseInt(value) || 0 });
    } else {
      setEditedIndent({ ...editedIndent, [name]: value });
    }
  };

  // Filter indents based on search and filters
  const filteredIndents = indents.filter(indent => {
    const matchesSearch = 
      indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.doerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority ? indent.priority === filterPriority : true;
    
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading indents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search indents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Plus size={16} />
              New Indent
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
        {filteredIndents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No indents found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first indent</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Plus size={16} />
              Create New Indent
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
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
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIndents.map((indent) => (
                    <tr key={indent.id} className="hover:bg-gray-50 transition-colors">
                      {editingIndentId === indent.id ? (
                        // Edit Mode
                        <>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="indentNumber" value={editedIndent?.indentNumber || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="machineName" value={editedIndent?.machineName || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="machineSerialNo" value={editedIndent?.machineSerialNo || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="doerName" value={editedIndent?.doerName || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="department" value={editedIndent?.department || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="machinePartName" value={editedIndent?.machinePartName || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2">
                            <textarea name="problem" value={editedIndent?.problem || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none" rows={1} />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <select name="priority" value={editedIndent?.priority || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs">
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="number" name="expectedDeliveryDays" value={editedIndent?.expectedDeliveryDays || 0} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" min="1" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input type="text" name="location" value={editedIndent?.location || ''} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-900 transition-colors" title="Save"><Save size={14} /></button>
                              <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900 transition-colors" title="Cancel"><X size={14} /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-sky-600">{indent.indentNumber}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.machineName}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{indent.machineSerialNo}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{indent.doerName}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{indent.department}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{indent.machinePartName}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate" title={indent.problem}>{indent.problem}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${getPriorityColor(indent.priority)}`}>{indent.priority}</span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{indent.expectedDeliveryDays} days</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{indent.location}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEditIndent(indent)} className="text-green-600 hover:text-green-900 transition-colors" title="Edit"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteIndent(indent.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex-1 overflow-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {filteredIndents.map((indent) => (
                <div key={indent.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-bold text-sky-600 block">{indent.indentNumber}</span>
                      <span className="text-xs text-gray-500">{new Date(indent.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(indent.priority)}`}>
                        {indent.priority}
                      </span>
                      {/* Mobile Actions */}
                      <div className="flex gap-1">
                        <button onClick={() => handleEditIndent(indent)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Edit size={14} /></button>
                        <button onClick={() => handleDeleteIndent(indent.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block">Machine</span>
                      <span className="font-medium text-gray-900">{indent.machineName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Department</span>
                      <span className="font-medium text-gray-900">{indent.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Part</span>
                      <span className="font-medium text-gray-900">{indent.machinePartName}</span>
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

      {/* Indent Form Modal */}
      <IndentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddIndent={handleAddIndent}
      />
    </div>
  );
};

export default Indent;