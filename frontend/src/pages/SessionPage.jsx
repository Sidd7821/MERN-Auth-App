import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
// import { Trash2 } from "lucide-react";

// const API_URL =
//     import.meta.env.MODE === "development"
//         ? "http://localhost:5001/api/session"
//         : "/api/session";

const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5001/api/session"
        : `${window.location.origin}/api/session`;

const SessionPage = () => {
    const { logout } = useAuthStore();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        value: "",
        url: "",
        description: "",
        isActive: true,
    });

    console.log("SessionPage rendered", window.location.origin);
    const fetchSessions = async () => {
        try {
            const response = await axios.post(`${API_URL}/list`);
            setSessions(response.data.data.rows || []);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast.error("Failed to fetch sessions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            value: "",
            url: "",
            description: "",
            isActive: true,
        });
        setIsEditing(false);
        setEditId(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            const data = response.data.data;
            setFormData({
                name: data.name || "",
                value: data.value || "",
                url: data.url || "",
                description: data.description || "",
                isActive: data.isActive || false,
            });
            setIsEditing(true);
            setEditId(id);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching session by ID:", error);
            toast.error("Failed to fetch session data.");
        }
    };

    const handleSubmit = async () => {
        try {
            if (isEditing && editId) {
                await axios.put(`${API_URL}/${editId}`, formData);
                toast.success("Session updated successfully!");
            } else {
                await axios.post(`${API_URL}/`, formData);
                toast.success("Session added successfully!");
            }
            setShowModal(false);
            resetForm();
            fetchSessions();
        } catch (error) {
            console.error("Error submitting session:", error);
            toast.error("Something went wrong while saving session.");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API_URL}/${deleteId}`);
            toast.success("Session deleted successfully!");
            setShowDeleteModal(false);
            fetchSessions();
        } catch (error) {
            console.error("Error deleting session:", error);
            toast.error("Failed to delete session.");
        }
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl w-full mx-auto mt-10 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                    Sessions Dashboard
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenAddModal}
                    className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700"
                >
                    + Add Session
                </motion.button>
            </div>

            {loading ? (
                <p className="text-gray-400 text-center">Loading sessions...</p>
            ) : sessions.length === 0 ? (
                <p className="text-gray-400 text-center">No sessions found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {sessions.map((session, index) => {
                        const sessionUrl = `${API_URL}/${session._id}`;
                        return (
                            <motion.div
                                key={session._id}
                                className="p-5 bg-gray-900 bg-opacity-80 rounded-xl shadow-xl border border-gray-800 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                {/* Delete button in top right corner */}
                                <button
                                    onClick={() =>
                                        handleDeleteClick(session._id)
                                    }
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label="Delete session"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>

                                <h3 className="text-xl font-semibold text-purple-400 mb-2 pr-6">
                                    {session.name}
                                </h3>
                                <p className="text-gray-300 mb-1">
                                    {session.description}
                                </p>
                                <div className="flex items-center text-gray-400 text-sm mb-1 space-x-2">
                                    <span>URL: {session.url}</span>
                                    {session.url && (
                                        <a
                                            href={session.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-400 hover:text-purple-500"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mb-2">
                                    Created: {formatDate(session.createdAt)}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={sessionUrl}
                                        readOnly
                                        className="flex-1 px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded"
                                    />
                                    <button
                                        onClick={() => handleCopy(sessionUrl)}
                                        className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEdit(session._id)}
                                    className="mt-4 w-full py-2 px-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600"
                                >
                                    Edit
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700"
                >
                    Logout
                </motion.button>
            </motion.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h3 className="text-2xl font-semibold text-purple-400 mb-4 text-center">
                                {isEditing ? "Edit Session" : "Add New Session"}
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                                />
                                <input
                                    type="text"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    placeholder="Value"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                                />
                                <input
                                    type="text"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="URL"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                                />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                                />
                                <label className="flex items-center space-x-2 text-white">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="form-checkbox h-5 w-5 text-purple-500"
                                    />
                                    <span>Is Active</span>
                                </label>
                            </div>
                            <div className="flex justify-end mt-6 space-x-4">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                                >
                                    {isEditing ? "Update" : "Save"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h3 className="text-2xl font-semibold text-red-400 mb-4 text-center">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-300 mb-6 text-center">
                                Are you sure you want to delete this session?
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SessionPage;
