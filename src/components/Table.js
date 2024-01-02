import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "react-phone-number-input/input";

function Table({ data, type, headings, handleDelete, handleEdit }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);  // Adjust number of items per page as needed

  // Calculate the index of the last and first items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the data to only include items for the current page
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderTableData = () => {
    if (type === "customers") {
      return currentItems.map((user, index) => {
        const { id, name, phone } = user; //destructuring
        return (
          <tr key={id}>
            <th>{index + 1}</th>
            <td className="truncate w-5 max-w-0 md:w-24 lg:whitespace-pre-wrap" >{name}</td>
            <td className="px-0">
              <Input
                value={phone}
                className="bg-transparent w-full max-w-xs"
                disabled={true}
              />
            </td>
            <td>
              <div className="flex flex-row ">
                <button
                  className="btn btn-info mr-5"
                  onClick={() => handleEdit(user)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            </td>
          </tr>
        );
      });
    } else {
      return currentItems.map((pitch, index) => {
        return (
          <tr key={pitch.id}>
            <th className="text-center">{index + 1}</th>
            <td className="text-center font-semibold">{pitch.name}</td>
            <td className="text-center font-semibold">{pitch.minute}</td>
            <td>
              <div className="flex flex-row ">
                <button
                  className="btn btn-accent mr-5"
                  onClick={() => handleEdit(pitch)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleDelete(pitch)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </td>
          </tr>
        );
      });
    }
  };

  // Logic to change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

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
    <div className="flex flex-col items-center justify-center">
      <table className="table ">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th className="w-28 md:w-32">{headings.first}</th>
            <th>{headings.second}</th>
            <th>⚙️ Duzenle</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
      {/* Pagination Controls */}
      <div className="join self-center">
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
  );
}

export default Table;
