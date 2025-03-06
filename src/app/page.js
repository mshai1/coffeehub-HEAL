"use client"

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!started ? (
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Empathy Lab</h1>
          <p className="mb-6">Explore the challenges of accessibility through interactive exercises.</p>
          <button 
            onClick={() => setStarted(true)} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      ) : (
        <Survey />
      )}
    </div>
  );
}

function Survey() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ gender: "", empathy: "" });

  const handleNext = () => setStep(step + 1);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      {step === 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Tell us about yourself</h2>
          <label className="block mb-2">Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 w-full mb-4">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Next</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Do you know about empathy?</h2>
          <select name="empathy" value={formData.empathy} onChange={handleChange} className="border p-2 w-full mb-4">
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">You look tired with all these questions... Let's get you a coffee!</h2>
          <Link href="/coffee">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Make Coffee</button>
          </Link>
        </div>
      )}
    </div>
  );
}
