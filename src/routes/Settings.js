import React from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Settings() {
  const navigate = useNavigate();

  const logOutHandler = async () => {
    await signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const logOffButton = (
    <button
      onClick={logOutHandler}
      className="btn btn-ghost normal-case text-xl xl:text-3xl"
    >
      🚪
    </button>
  );

  return (
    <div>
      <Navbar endButton={logOffButton} />
      <div className="flex flex-row  gap-10 md:gap-0 flex-wrap justify-center items-center lg:justify-around">
        <Card icon="⚙️" title="Genel" route="generalSettings" />
        <Card icon="📰" title="Duyurular" route="announcementsettings" />
        <Card icon="📱" title="SMS" route="smsSettings" />
        <Card icon="📢" title="Anons" route="matchannouncements" />
        <Card icon="🏟️" title="Saha" route="pitchSettings" />
        <Card icon="⛓️" title="Şema" route="schemaSettings" />
        <Card icon="🥅" title="Skor Tablosu" route="score" />
      </div>
    </div>
  );
}

export default Settings;
