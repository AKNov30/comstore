import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

type MockUser = {
    id: string;
    email: string;
    password: string;
    displayName: string;
    role: "admin" | "user";
};

const MOCK_USERS: MockUser[] = [
    { id: "u1", email: "admin", password: "1234", displayName: "Admin User", role: "admin" },
    { id: "u2", email: "demo", password: "demo", displayName: "Demo User", role: "user" },
];


// mock “เหมือนเรียก API”
async function mockLogin(
    email: string,
    password: string
): Promise<{ token: string; user: Omit<MockUser, "password"> }> {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _pw, ...user } = found;
    const token = btoa(`${user.id}:${Date.now()}`);
    return { token, user };
}

type LoginProps = {
    isOpen: boolean;
    onClose?: () => void;
    onSuccess?: (payload: {
        token: string;
        user: { id: string; email: string; displayName: string; role: "admin" | "user" };
        loggedAt: string;
    }) => void;
    /** เพิ่ม callback สำหรับเปิดหน้า Register */
    onOpenRegister?: () => void;
};

export function Login({ isOpen, onClose, onSuccess, onOpenRegister }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isLoading;

    // ปิดด้วย ESC
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) onClose?.();
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleKeyDown]);

    // กัน scroll พื้นหลังเมื่อเปิดโมดัล
    useEffect(() => {
        if (isOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = original; };
        }
    }, [isOpen]);

    // Icon ตา สำหรับซ่อนรหัสผ่าน
const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const EyeOffIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10.6 10.6A3 3 0 0013.4 13.4M9.9 5.1C10.58 5.03 11.28 5 12 5c6.4 0 10 7 10 7a16.9 16.9 0 01-4.07 4.87M6.1 6.1A17.06 17.06 0 002 12s3.6 7 10 7a12.4 12.4 0 004.1-.68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!canSubmit) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setIsLoading(true);
            const { token, user } = await mockLogin(email.trim(), password);

            const payload = { token, user, loggedAt: new Date().toISOString() };
            if (remember) localStorage.setItem("auth", JSON.stringify(payload));
            else sessionStorage.setItem("auth", JSON.stringify(payload));

            onSuccess?.(payload);
            onClose?.();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            aria-modal="true"
            role="dialog"
            aria-labelledby="login-title"
            className="fixed inset-0 z-50"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={() => onClose?.()} />

            {/* Modal container */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
                >
                    {/* ปุ่มปิด */}
                    <button
                        type="button"
                        onClick={() => onClose?.()}
                        aria-label="Close"
                        className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>

                    <h1 id="login-title" className="text-2xl font-bold text-center text-gray-800 mb-6">
                        เข้าสู่ระบบ
                    </h1>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm p-3">{error}</div>
                    )}

               
                    <input
                        id="email"
                        type="text"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="อีเมล"
                    />

                    {/* Password */}
                    
                    <div className="mb-4 relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="รหัสผ่าน"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute inset-y-0 right-2 my-auto text-sm text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {/* Remember me / Forgot */}
                    <div className="mb-6 flex items-center justify-between">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            จำฉันเข้าระบบ
                        </label>
                        <button
                            type="button"
                            onClick={() => alert("This is a demo.")}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            ลืมรหัสผ่าน ?
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 "
                    >
                        {isLoading ? "ลงชื่อเข้าใช้..." : "เข้าสู่ระบบ"}
                    </button>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">หรือเข้าสู่ระบบด้วย</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {/* Facebook */}
                            <button
                                type="button"
                                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`}
                                className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#3B5998] text-white font-medium py-2.5 hover:bg-[#166FE5] transition-colors"
                            >
                                {/* Facebook icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-white"
                                >
                                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24h11.495V14.708h-3.13v-3.62h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.317h3.587l-.467 3.62h-3.12V24h6.116C23.406 24 24 23.406 24 22.676V1.325C24 .593 23.406 0 22.675 0z" />
                                </svg>
                                เข้าสู่ระบบด้วย Facebook
                            </button>

                            {/* Google */}
                            <button
                                type="button"
                                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
                                className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#242424] text-white font-medium py-2.5 hover:bg-[#333] transition-colors"
                            >
                                {/* Google icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                    className="w-5 h-5"
                                >
                                    <path fill="#FFC107" d="M43.611 20.083h-1.961V20H24v8h11.303A11.98 11.98 0 0 1 12 24a12 12 0 0 1 20.485-8.485l5.657-5.657C34.105 6.686 29.324 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10.508 0 19.262-7.688 19.262-20 0-1.327-.137-2.637-.388-3.917z" />
                                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819A11.97 11.97 0 0 1 24 12c3.163 0 6.045 1.196 8.223 3.151l5.657-5.657C34.105 6.686 29.324 4 24 4c-7.769 0-14.374 4.39-17.694 10.691z" />
                                    <path fill="#4CAF50" d="M24 44c5.183 0 9.522-1.714 12.697-4.656l-5.871-4.946C28.74 35.131 26.505 36 24 36a11.98 11.98 0 0 1-11.272-7.889l-6.53 5.038C9.654 39.671 16.21 44 24 44z" />
                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.1 5.4l5.871 4.946C38.497 36.779 44 32 44 24c0-1.327-.137-2.637-.389-3.917z" />
                                </svg>
                                เข้าสู่ระบบด้วย Google
                            </button>
                        </div>
                    </div>


                    {/* 🔹 ปุ่มไป Register */}
                    <div className="mt-6 flex justify-center items-center gap-2 text-sm text-gray-600">
                        <p className="text-sm text-gray-600">
                            ไม่ใช่สมาชิก? 
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                onClose?.();          // ปิด login popup
                                onOpenRegister?.();   // เปิด register popup
                            }}
                            className=" text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            สมัครสมาชิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
