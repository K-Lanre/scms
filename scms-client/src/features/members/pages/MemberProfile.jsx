import React from "react";
import { useParams } from "react-router-dom";

const MemberProfile = () => {
  const { id } = useParams();
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Member Profile</h1>
      <p className="text-gray-600">
        Viewing details for member ID:{" "}
        <span className="font-semibold text-blue-600">{id}</span>
      </p>
      <div className="mt-8 p-8 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
        Member Profile Content Placeholder
      </div>
    </div>
  );
};

export default MemberProfile;
