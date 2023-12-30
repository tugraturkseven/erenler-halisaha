import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Input from "react-phone-number-input/input";

function Table({ data }) {
  const renderTableData = () => {
    return data.map((user, index) => {
      const { id, name, phone } = user; //destructuring
      return (
        <tr key={id}>
          <th>{index + 1}</th>
          <td>{name}</td>
          <td className="px-0">
            <Input
              value={phone}
              className="bg-transparent w-full max-w-xs"
              disabled={true}
            />
          </td>
          <td>
            <div className="flex flex-row justify-center">
              <button
                className="btn btn-success"
                onClick={() => handleChoose(user)}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </td>
        </tr>
      );
    });

  };
  const handleChoose = (user) => {

  }

  return (
    <div className="">
      <table className="table ">
        <thead>
          <tr>
            <th></th>
            <th>🏷️ Isim</th>
            <th>📞 Telefon</th>
            <th>🧲 Müşteri Seç</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
}

export default Table;