import { FaUser } from 'react-icons/fa'
import { useAuth } from '../context/authContext'

const Summary = () => {
    const { user } = useAuth()
    return (
        <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-20 h-20 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md`}>
                        <FaUser className="text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-600">Welcome</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{user.name}</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Summary