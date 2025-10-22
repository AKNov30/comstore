import React, { useEffect, useState, useCallback } from "react";

type MockUser = {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone?: number;
  date?: string; // เก็บเป็นสตริง mm/dd/yy ตาม UI
  role: "admin" | "user";
};

// ------ Mock user store (localStorage) ------
const USERS_KEY = "auth_users";

function seedIfEmpty() {
  const exists = localStorage.getItem(USERS_KEY);
  if (!exists) {
    const seed: MockUser[] = [
      { id: "u1", email: "admin", password: "1234", firstname: "Admin", lastname: "User", phone: 897894516, date: "12/20/2001", role: "admin" },
      { id: "u2", email: "demo",  password: "demo",  firstname: "Demo",  lastname: "User",  role: "user"  },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  }
}

function loadUsers(): MockUser[] {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as MockUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function emailExists(email: string) {
  const users = loadUsers();
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}

function createUser(data: Omit<MockUser, "id" | "role"> & { role?: MockUser["role"] }): MockUser {
  const users = loadUsers();
  const newUser: MockUser = {
    id: "u" + Date.now(),
    role: data.role ?? "user",
    email: data.email,
    password: data.password,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    date: data.date,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

type RegisterProps = {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: (payload: {
    token: string;
    user: { id: string; email: string; displayName: string; role: "admin" | "user" };
    loggedAt: string;
  }) => void;
  /** เปิดหน้า Login */
  onOpenLogin?: () => void;
};

export function Register({ isOpen, onClose, onSuccess ,onOpenLogin}: RegisterProps) {
  // ฟิลด์ใหม่ตามภาพ
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname]   = useState("");
  const [phone, setPhone]         = useState<string>("");
  const [date, setDate]           = useState<string>(""); // mm/dd/yy
  // เดิม
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const displayName = `${firstname || ""}${lastname ? " " + lastname : ""}`.trim();

  const canSubmit =
    firstname.trim().length > 0 &&
    lastname.trim().length  > 0 &&
    email.trim().length     > 0 &&
    password.trim().length  >= 4 &&
    confirm === password &&
    !isLoading;

  // ปิดด้วย ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) onClose?.();
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // กัน scroll พื้นหลังตอนเปิด modal
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  // password strength (ง่าย ๆ)
  const strength = Math.min(
    3,
    (password ? 1 : 0) +
      (password.length >= 6 ? 1 : 0) +
      (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password) ? 1 : 0)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please fill in all fields correctly.");
      return;
    }
    if (emailExists(email.trim())) {
      setError("This email is already taken.");
      return;
    }

    try {
      setIsLoading(true);
      // จำลองดีเลย์
      await new Promise((r) => setTimeout(r, 700));

      const user = createUser({
        email: email.trim(),
        password,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        phone: phone ? Number(phone.replace(/\D/g, "")) : undefined,
        date: date || undefined,
      });

      // สร้าง token และล็อกอินอัตโนมัติ
      const token = btoa(`${user.id}:${Date.now()}`);
      const payload = {
        token,
        user: { id: user.id, email: user.email, displayName, role: user.role },
        loggedAt: new Date().toISOString(),
      };
      localStorage.setItem("auth", JSON.stringify(payload));

      onSuccess?.(payload);
      onClose?.();
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div aria-modal="true" role="dialog" aria-labelledby="register-title" className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />
      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
          {/* close */}
          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>

          <h1 id="register-title" className="text-2xl font-bold text-center mb-6 ">
            ลงทะเบียน
          </h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm p-3">{error}</div>
          )}

          {/* แถว 1: ชื่อ / นามสกุล */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ชื่อ"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          {/* แถว 2: เบอร์โทรศัพท์ / วันเกิด */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">วันเกิด</label>
              <input
                id="date"
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="mm/dd/yy"
              />
              {/* ถ้าอยากใช้ date picker จริง: type="date" แล้วจัด format เอง */}
            </div>
          </div>

          {/* อีเมล */}
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="อีเมล"
            />
          </div>

          {/* รหัสผ่าน + แถบความแข็งแรง */}
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="รหัสผ่าน"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto p-2 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {/* ไอคอนตาแบบง่าย */}
                {showPw ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10.6 10.6A3 3 0 0013.4 13.4M9.9 5.1C10.58 5.03 11.28 5 12 5c6.4 0 10 7 10 7a16.9 16.9 0 01-4.07 4.87M6.1 6.1A17.06 17.06 0 002 12s3.6 7 10 7a12.4 12.4 0 004.1-.68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div
                className={`h-1 rounded ${["bg-red-400", "bg-yellow-400", "bg-green-400"][Math.max(0, strength - 1)]}`}
                style={{ width: `${(strength / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div className="mt-4">
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
            <input
              id="confirm"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ยืนยันรหัสผ่าน"
            />
          </div>

          {/* ปุ่มสมัครสมาชิก (สีแดงเหมือนภาพ) */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>

          {/* ลิงก์กลับไปหน้า Login */}
          <div className="mt-6 flex justify-center items-center gap-2 text-sm text-gray-600">
            <span>มีบัญชีอยู่แล้ว?</span>
            <button
              type="button"
              onClick={() => { onClose?.(); onOpenLogin?.(); }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
