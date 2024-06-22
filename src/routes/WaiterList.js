import React from "react";
import { useNavigate } from "react-router-dom";

const WaiterList = ({
  data,
  pitch,
  index,
  date,
  sendMessage,
  handleAssign,
}) => {
  const navigate = useNavigate();

  const handleAddWaiter = () => {
    navigate("/chooseCustomer", {
      state: { pitch: pitch, index: index, date: date, addSubscriber: true },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        className="btn bg-base-200 w-full normal-case"
        onClick={handleAddWaiter}
      >
        ➕ Yeni Bekleyen Ekle
      </button>
      <div className="bg-base-200 rounded-lg h-96 w-80 max-w-80 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-4">
        {data &&
          data.map((waiter, index) => (
            <div key={index} className="flex flex-row flex-nowrap items-center">
              <div className="flex flex-1  line-clamp-1 text-ellipsis whitespace-nowrap">
                {index + 1}- {waiter.name}
              </div>
              <div className="w-fit flex flex-row gap-1">
                <button
                  className="btn btn-sm  btn-ghost normal-case text-lg"
                  onClick={() => sendMessage(waiter.phoneNumber)}
                >
                  📞
                </button>
                <button
                  className="btn btn-sm  btn-ghost normal-case text-lg"
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
