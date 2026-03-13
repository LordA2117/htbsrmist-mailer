// EmailTable.js
import React from "react";

const EmailTable = ({ emails }) => {
  return (
    <div className="h-full max-h-[500px] overflow-auto p-8 bg-transparent">
      <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6 border-b border-white/5 pb-4">Delivery Status</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#333] text-gray-400 text-sm tracking-wider uppercase">
              <th className="py-3 px-4 font-semibold">Target Email</th>
              <th className="py-3 px-4 font-semibold text-center w-24">Delivered</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {emails.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-8 text-center text-gray-500 italic">No emails dispatched yet in this session.</td>
              </tr>
            ) : (
              emails.map((email, index) => (
                <tr key={index} className="border-b border-[#222] hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-gray-300 font-mono">{email}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="w-5 h-5 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailTable;
