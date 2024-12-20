import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNextSameDayDate } from "../utils/SameDaysDate";

const WaiterList = ({
  data,
  sendMessage,
  handleAssign,
  handleRemove,
  addNew,
  pitch,
  index,
  date,
}) => {
  const navigate = useNavigate();

  const handleAddWaiter = () => {
    navigate("/chooseCustomer", {
      state: { pitch: pitch, index: index, date: date },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {addNew ? (
        <>
          <button
            className="btn bg-base-200 w-full normal-case"
            onClick={handleAddWaiter}
          >
            ➕ Yeni Bekleyen Ekle
          </button>
        </>
      ) : (
        <h2 className="text-xl text-center">Bekleyen Listesi</h2>
      )}
      <button
        className="btn bg-base-200 w-full normal-case"
        onClick={() => handleRemove()}
      >
        ⛔ Listeyi Temizle
      </button>
      <div className="bg-base-200 rounded-lg min-h-80 w-80 max-h-96  max-w-80 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-4">
        {data &&
          data.map((waiter, index) => (
            <div key={index} className="flex flex-row flex-nowrap items-center">
              <div className="flex flex-1  line-clamp-1 text-ellipsis whitespace-nowrap">
                {index + 1}- {waiter.name}
              </div>
              <div className="w-fit flex flex-row gap-1">
                <button
                  className="btn btn-xs  btn-ghost normal-case text-lg"
                  onClick={() => sendMessage(waiter.phoneNumber)}
                >
                  📞
                </button>
                <button
                  className="btn btn-xs btn-ghost normal-case text-lg"
                  onClick={() => handleRemove(waiter)}
                >
                  ⛔
                </button>
                <button
                  className="btn btn-xs btn-ghost normal-case text-lg"
                  onClick={() => handleAssign(waiter)}
                >
                  ✅
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WaiterList;
