import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    const uid = searchParams.get("uid");
    if (!uid) {
      alert("Geçersiz şifre sıfırlama bağlantısı!");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "https://erenler-halisaha-backend.vercel.app/set-new-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            newPassword: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Şifreniz başarıyla güncellendi!");
      navigate("/");
    } catch (error) {
      console.error("Error setting new password:", error);
      alert("Şifre güncellenirken bir hata oluştu!");
    }
  };

  return (
    <div className="flex h-full shadow-2xl items-center justify-center flex-col rounded-lg px-16 md:flex-row">
      <article className="prose lg:prose-lg md:prose-md sm:prose-sm flex flex-col">
        <p className="text-2xl font-bold text-center md:text-4xl !m-4">
          🔐 Şifre Yenileme
        </p>
      </article>
      <div className="mt-10 md:mx-10 lg:w-56 space-y-5">
        <input
          type="password"
          placeholder="🔑 Yeni Şifre"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="🔑 Şifre Tekrar"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className="btn btn-success btn-block">
          ✨ Şifreyi Güncelle
        </button>
        <a href="/" className="btn btn-info btn-block">
          🚪 Giriş Sayfası
        </a>
      </div>
    </div>
  );
}

export default ResetPassword;
