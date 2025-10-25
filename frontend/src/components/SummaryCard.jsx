import React from 'react'

const SummaryCard = ({ icon, title, number, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white shadow-md`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-600">{title}</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{number}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryCard