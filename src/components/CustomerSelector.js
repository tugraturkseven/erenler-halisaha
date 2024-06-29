import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Input from "react-phone-number-input/input";
import { useNavigate, useLocation } from "react-router-dom";
import { addSubscriberToReservation } from "../firebase";
import { toast } from "react-toastify";

function Table({ data }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { pitch, index, date } = location.state;
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust number of items per page as needed

  // Calculate the index of the last and first items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the data to only include items for the current page
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    // Reset page number when data changes
    setCurrentPage(1);
  }, [data]);

  const renderTableData = () => {
    return currentItems.map((user, index) => {
      const { id, name, phone } = user;
      return (
        <tr key={id}>
          <th>{index + 1}</th>
          {/* Set a fixed height and allow for scrolling if content overflows */}
          <td
            style={{
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: "3em", // Adjust as needed based on your line height
            }}
            className="py-0"
          >
            {name}
          </td>
          {/* Ensure input has enough space to display the phone number */}
          <td className="px-0">
            <Input
              value={phone}
              className="bg-transparent w-full"
              disabled={true}
            />
          </td>
          {/* Use flex and justify-end to align the button to the right */}
          <td className="flex justify-center gap-3">
            <button
              className="btn bg-black p-3 text-lg relative"
              onClick={() => handleAddWishList(user)}
            >
              <p>⌛</p>
              <p className="absolute text-xl top-0 right-1 text-green-300">+</p>
            </button>
            <button
              className="btn btn-success p-3"
              onClick={() => handleChoose(user)}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </td>
        </tr>
      );
    });
  };

  // Logic to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      pages = [
        1,
        ...Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ),
        totalPages,
      ];

      // Logic to add ellipses
      if (startPage > 2) {
        pages.splice(1, 0, "...");
      }
      if (endPage < totalPages - 1) {
        pages.splice(pages.length - 1, 0, "...");
      }
    }
    return pages;
  };

  const handleAddWishList = async (user) => {
    const [day, month, year] = date.split(".");
    const customer = {
      phoneNumber: user.phone,
      name: user.name,
    };
    try {
      await addSubscriberToReservation(
        year,
        month,
        day,
        pitch,
        index,
        customer
      );
      navigate("/reservation", { state: { date } });
      setTimeout(() => {
        toast(`${user.name} bekleyen listesine eklendi`);
      }, 1);
    } catch (err) {
      toast(`${user.name} bekleyen listesinde kayıtlıdır.`, {
        type: "error",
      });
    }
  };

  const handleChoose = async (user) => {
    navigate("/reservationDetails", { state: { user, pitch, index, date } });
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th className="w-24 md:w-32">🏷️ Isim</th>
            <th style={{ minWidth: "115px" }}>📞 Telefon</th>
            <th>🧲 Müşteri Seç</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
      {/* Pagination Controls */}
      <div className="join self-center mt-7">
        {generatePageNumbers().map((number, index) => (
          <button
            key={index}
            className={`join-item btn ${
              number === currentPage ? "btn-disabled" : ""
            }`}
            onClick={() => number !== "..." && paginate(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Table;
