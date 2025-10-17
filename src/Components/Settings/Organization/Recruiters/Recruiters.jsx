import { useDispatch, useSelector } from 'react-redux';
import { getRecruiters, deleteRecruiter } from "../../../../redux/apiCalls/RecruiterCallApi";
import { useEffect, useState } from 'react';
import EditRecruiters from './EditRecruiters';
import { X, Trash2 } from 'lucide-react'; 
import InviteRecModal from '../../../Dashboard/AddMenus/ModelsForAdd/InviteRecModal';
import { usePermission } from '../../../hooks/usePermission';
import Loader from '../../../Loader';

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, recruiterName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Delete User
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Sure you want to delete {recruiterName}?
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Recruiters() {
    const [isEditCompOpen, setIsEditCompOpen] = useState(false);
    const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);
    const [openForm, setOpenForm] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recruiterToDelete, setRecruiterToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recruitersPerPage = 10;

    const { recruiters, recruiter, loading, error } = useSelector(state => state.recruiters);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getRecruiters());
    }, [dispatch]);

    const handleOpen = () => setOpenForm('Invite_rec_modal');
    
    const handleClose = (shouldRefresh = false) => {
        setOpenForm(null);
        if (shouldRefresh) {
            dispatch(getRecruiters());
        }
    };

    const handleDelete = (recruiter) => {
        setRecruiterToDelete(recruiter);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (recruiterToDelete) {
            dispatch(deleteRecruiter(recruiterToDelete.id));
            setCurrentPage(1); // Reset to first page after deletion
        }
        setIsDeleteModalOpen(false);
        setRecruiterToDelete(null);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setRecruiterToDelete(null);
    };

    const handleEdit = (recruiterId) => {
        setSelectedRecruiterId(recruiterId);
        setIsEditCompOpen(true);
    };

    const handleCancelEdit = () => {
        setIsEditCompOpen(false);
        setSelectedRecruiterId(null);
        dispatch(getRecruiters());
    };

    const canCreateStaff = usePermission("create staff");
    const canEditStaff = usePermission("edit staff");
    const canDeleteStaff = usePermission("destroy staff");
    
    const filteredRecruiters = recruiters?.customers?.filter(recruiter => {
        const name = recruiter?.name?.toLowerCase() || '';
        const email = recruiter?.email?.toLowerCase() || '';
        const phone = recruiter?.phone || '';
        const parent = recruiter?.parent?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return name.includes(searchLower) || 
               email.includes(searchLower) || 
               phone.includes(searchTerm) || 
               parent.includes(searchLower);
    }) || [];

    // Pagination Logic
    const indexOfLastRecruiter = currentPage * recruitersPerPage;
    const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage;
    const currentRecruiters = filteredRecruiters.slice(indexOfFirstRecruiter, indexOfLastRecruiter);
    const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPagination = () => {
        if (filteredRecruiters.length <= recruitersPerPage) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-between items-center mt-4 px-6 py-3 bg-white border-t">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstRecruiter + 1} to {Math.min(indexOfLastRecruiter, filteredRecruiters.length)} of {filteredRecruiters.length} Users
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Previous
                    </button>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === number
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    if (loading && !recruiters?.customers) {
        return (
            <div className="p-6 bg-gray-50 flex items-center justify-center">
                <p className=""><Loader/></p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {filteredRecruiters?.length || 0}
                    </span>
                    {loading && (
                        <span className="text-sm text-blue-500">Loading...</span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 mb-5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pr-10 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg className="w-4 h-4 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>
                {canCreateStaff && (
                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        onClick={handleOpen}
                    >
                        <span>+</span>
                        New User
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Parent
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentRecruiters.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        {loading ? 'Loading users...' : 'No data to display'}
                                    </td>
                                </tr>
                            ) : (
                                currentRecruiters.map((recruiter) => (
                                    <tr key={recruiter.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center max-w-[150px] truncate tooltip" title={recruiter?.parent}>
                                            {recruiter?.parent || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left max-w-[150px] truncate tooltip" title={recruiter?.name}>
                                            {recruiter?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center max-w-[150px] truncate tooltip" title={recruiter?.email}>
                                            {recruiter?.email || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center max-w-[150px] truncate tooltip" title={recruiter?.phone}>
                                            {recruiter?.phone || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center justify-center gap-2">
                                                {canEditStaff && (
                                                    <button 
                                                        onClick={() => handleEdit(recruiter.id)} 
                                                        className="text-blue-600 hover:text-blue-900 p-1" 
                                                        disabled={loading}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                        </svg>
                                                    </button>
                                                )}
                                                {canDeleteStaff && (
                                                    <button 
                                                        onClick={() => handleDelete(recruiter)} 
                                                        className="text-red-600 hover:text-red-900 p-1" 
                                                        disabled={loading}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {renderPagination()}
                {openForm === 'Invite_rec_modal' && (
                    <InviteRecModal
                        isOpen={true} 
                        onClose={handleClose}
                    />
                )}
                <EditRecruiters
                    isOpen={isEditCompOpen}
                    onCancel={handleCancelEdit}
                    recruiterId={selectedRecruiterId}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    recruiterName={recruiterToDelete?.name}
                />
            </div>
        </div>
    );
}