import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState("");
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const resetPassword = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      alert("Lütfen geçerli bir telefon numaranızı giriniz.");
      return;
    }

    const url =
      "https://erenler-halisaha-backend.vercel.app/request-password-reset";
    const data = {
      phoneNumber: phoneNumber,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert("Şifre sıfırlama isteğiniz başarılı. Admin email'e gönderildi.");
      return result;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = phoneNumber + "@efelerpark.com";
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/reservation");
        // ...
      })
      .catch(() => {
        alert("Hatalı Giriş");
      });
  };

  const noticesOnClick = () => {
    navigate("/notices");
  };

  return (
    <div className="flex h-full shadow-2xl  items-center justify-center flex-col rounded-lg px-16 md:flex-row">
      <article className="prose lg:prose-lg md:prose-md sm:prose-sm flex flex-col">
        <p className="text-2xl font-bold text-center md:text-4xl !m-4 ">
          Hoşgeldiniz! 👋
        </p>
        <p className="text-sm text-center md:text-2xl !m-0">
          Efeler Park Halısaha
        </p>
        <span
          className="text-center text-xl font-bold underline underline-offset-8 cursor-pointer mt-8"
          onClick={noticesOnClick}
        >
          📢 Duyurular
        </span>
      </article>
      <div className="mt-10 md:mx-10 lg: w-56 space-y-5">
        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        {!isForgetPassword ? (
          <>
            <input
              type="password"
              placeholder="🔑 Sifre"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="text-sm  text-center text-gray-400"
              onClick={() => setIsForgetPassword(true)}
            >
              Şifremi Unuttum
            </button>
            <a onClick={onSubmit} className="btn btn-success btn-block">
              🚪 Giriş Yap
            </a>
            <a href="/signin" className="btn btn-info btn-block">
              ✨ Kayıt Ol
            </a>
          </>
        ) : (
          <>
            <button
              onClick={resetPassword}
              className="btn btn-success btn-block"
            >
              🔑 Şifremi Sıfırla
            </button>
            <button
              onClick={() => setIsForgetPassword(false)}
              className="btn btn-info btn-block"
            >
              🚪 Geri Dön
            </button>
          </>
        )}
      </div>
      <span className="absolute bottom-5 text-xs mt-8 text-center">
        version: 11.12.2024 21:30
      </span>
    </div>
  );
}

export default Login;
