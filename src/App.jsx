import { useState, useEffect } from 'react'
import FoodItem from './components/user/FoodItem'
import CartModal from './components/user/CartModal'
import { Link } from 'react-router-dom'

const menu = [
  { id: 1, name: 'ข้าวผัด', price: 50 },
  { id: 2, name: 'ต้มยำกุ้ง', price: 80 },
  { id: 3, name: 'ข้าวกะเพรา', price: 60 },
  { id: 4, name: 'ก๋วยเตี๋ยว', price: 45 },
]

function App() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [queueNumber, setQueueNumber] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)

  const addToCart = (food) => {
    setCart([...cart, food])
  }

  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const confirmOrder = async () => {
    if (cart.length === 0) return;

    const params = new URLSearchParams()
    cart.forEach((item, index) => {
      params.append(`food${index + 1}`, `${item.name} (${item.price}฿)`)
    })

    const response = await fetch("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString()
    })

    const text = await response.text()
    if (response.ok) {
      const queueMatch = text.match(/Queue:(\d+)/)
      if (queueMatch) {
        const queue = parseInt(queueMatch[1])
        setQueueNumber(queue)
        const total = cart.reduce((sum, item) => sum + item.price, 0)
        setTotalPrice(total)
      }
      setCart([])
      setIsCartOpen(false)
    } else {
      alert("เกิดข้อผิดพลาดในการส่งออเดอร์")
    }
  }

  const resetApp = () => {
    setQueueNumber(null)
    setCart([])
  }

  // หน้าหลังยืนยันออเดอร์
  if (queueNumber !== null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
        <h2 className="text-2xl mb-4 text-center">🧾 ยืนยันออเดอร์เรียบร้อยแล้ว!</h2>

        <div className="text-5xl font-bold text-green-600 mb-3 text-center">
          คิวของคุณคือ #{queueNumber}
        </div>

        <div className="text-xl font-medium text-gray-700 mb-6 text-center">
          💵 ยอดที่ต้องชำระ: <span className="font-bold">{totalPrice} บาท</span> แสกน QR CODE ด้านล่างเพื่อจ่ายเงิน
        </div>

        <img
          src="/qr-code.png"
          alt="QR Code"
          className="w-48 h-48 mb-6 border border-gray-300 rounded"
        />

        <button
          onClick={resetApp}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ได้รับอาหารแล้ว
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h1 className="text-3xl font-bold mb-4 text-center">🍽️ เมนูอาหาร</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menu.map(item => (
          <FoodItem key={item.id} item={item} onAdd={addToCart} />
        ))}
      </div>

      {/* ปุ่มรถเข็นลอยมุมขวาล่าง */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg hover:bg-green-600 transition"
        title="เปิดรถเข็น"
      >
        🛒
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      <Link
        to="/seller"
        className="fixed bottom-24 right-6 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg hover:bg-green-600 transition"
        title="ไปยังหน้าคนขาย"
      >
        🧑‍🍳
      </Link>

      {/* Modal รถเข็น */}
      {isCartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          onConfirm={confirmOrder}
        />
      )}

      {/* Modal แจ้งเตือนตอนเปิดเว็บ */}
      {showWelcomeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">คำเตือน</h2>
            <p className="mb-6">website ยังไม่เสร็จ 100% ใช้เพื่อเป็นตัวอย่างเท่านนั้น</p>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
