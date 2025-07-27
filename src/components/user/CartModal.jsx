import { useState } from 'react'

function CartModal({ cart, onClose, onRemove, onConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleConfirm = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    await onConfirm()
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">🛒 รายการอาหารของคุณ</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">ยังไม่มีรายการอาหาร</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2">
                  <span>{item.name} ({item.price} บาท)</span>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:underline"
                  >
                    ลบ
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-right font-semibold mb-4">
              รวมทั้งหมด: {total} บาท
            </div>

            <button
              onClick={handleConfirm}
              className={`w-full py-2 rounded text-white ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังส่ง...' : '✅ ยืนยันออเดอร์'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CartModal
