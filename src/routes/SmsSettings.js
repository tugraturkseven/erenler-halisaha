import { useState, useEffect } from 'react'
import Navbar from "../components/Navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const SmsSettings = () => {
  const [smsTemplates, setSMSTemplates] = useState([]); // Table data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page


  // Calculate the index of the last and first items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the data to only include items for the current page
  const currentItems = smsTemplates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(smsTemplates.length / itemsPerPage);

  useEffect(() => {

  }, []);

  const handleDelete = (id) => {
    // Delete item from the table
    const updatedItems = smsTemplates.filter((item) => item.id !== id);
    setSMSTemplates(updatedItems);
  }

  const handleEdit = (template) => {
    // Handle edit here
    console.log(template);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  // Function to generate the array of page numbers to be displayed
  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      // Less than 5 total pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More than 5 pages, show first, last, and nearby current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pages = [1, ...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i), totalPages];

      // Logic to add ellipses
      if (startPage > 2) {
        pages.splice(1, 0, '...');
      }
      if (endPage < totalPages - 1) {
        pages.splice(pages.length - 1, 0, '...');
      }
    }
    return pages;
  };

  return (
    <div>
      <Navbar />
      <div className='flex flex-col justify-center items-center gap-7'>
        <h1 className='text-lg font-semibold'>📱 SMS Ayarları</h1>
        <div className='flex flex-col justify-center items-center'>
          <p className='text-md font-semibold'>⏰ Hatırlatıcı zamanlaması</p>
          <select className="select select-bordered w-full max-w-xs mt-3">
            <option disabled selected>Kaç dakika önce?</option>
            <option>15 Dakika önce</option>
            <option>30 Dakika önce</option>
            <option>45 Dakika önce</option>
            <option>60 Dakika önce</option>
          </select>
        </div>
        {/* Sms Sablonlari Tablosu */}
        <div className="overflow-x-auto max-w-md w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Adı</th>
                <th>Rol</th>
                <th>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((template, index) => {
                return (
                  <tr key={template.id}>
                    <th className="text-center">{index + 1}</th>
                    <td className="text-center font-semibold">{template.name}</td>
                    <td className="text-center font-semibold">{template.status}</td>
                    <td>
                      <button
                        className="btn btn-info mr-5"
                        onClick={() => handleEdit(template)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(template.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="join self-center mt-7">
          {generatePageNumbers().map((number, index) => (
            <button
              key={index}
              className={`join-item btn ${number === currentPage ? "btn-disabled" : ""}`}
              onClick={() => number !== '...' && paginate(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SmsSettings