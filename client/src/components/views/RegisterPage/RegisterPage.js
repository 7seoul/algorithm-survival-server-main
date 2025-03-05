import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", handle: "", local: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          handle: formData.handle,
          local: Number(formData.local),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("등록이 완료되었습니다!");
        setFormData({ name: "", handle: "", local: "" });
      } else {
        setMessage(data.message || "등록 실패");
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">등록하기</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="handle"
          placeholder="핸들"
          value={formData.handle}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <select
          name="local"
          value={formData.local}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="" disabled>
            지역 선택
          </option>
          <option value="1">서울</option>
          <option value="2">대전</option>
          <option value="3">광주</option>
          <option value="4">구미</option>
          <option value="5">부산</option>
        </select>
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white" disabled={loading}>
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
