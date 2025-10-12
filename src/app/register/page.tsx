"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth";
import { AxiosError } from "axios";

type FieldErrors = {
  [key: string]: string[];
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await authService.register(formData);
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<FieldErrors | { detail?: string }>;

      if (axiosError.response?.status === 400 && axiosError.response.data) {
        const data = axiosError.response.data;

        const isFieldErrors = (d: unknown): d is FieldErrors =>
          typeof d === "object" &&
          d !== null &&
          Object.values(d).every((v) => Array.isArray(v) && v.every((x) => typeof x === "string"));
        const isDetailError = (d: unknown): d is { detail?: string } =>
          typeof d === "object" && d !== null && "detail" in d;

        if (isFieldErrors(data)) {
          setFieldErrors(data);
          setError("Please correct the highlighted fields.");
        } else if (isDetailError(data) && data.detail) {
          setError(data.detail);
        } else {
          setError("Invalid input. Please check the form.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                fieldErrors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#e05c28]"
              }`}
            />
            {fieldErrors.username && <p className="text-red-500 text-sm mt-1">{fieldErrors.username[0]}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                fieldErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#e05c28]"
              }`}
            />
            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email[0]}</p>}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                fieldErrors.first_name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.first_name && <p className="text-red-500 text-sm mt-1">{fieldErrors.first_name[0]}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                fieldErrors.last_name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.last_name && <p className="text-red-500 text-sm mt-1">{fieldErrors.last_name[0]}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                fieldErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password[0]}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                fieldErrors.password2 ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {fieldErrors.password2 && <p className="text-red-500 text-sm mt-1">{fieldErrors.password2[0]}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e05c28] hover:bg-[#c84e20] text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#e05c28] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
