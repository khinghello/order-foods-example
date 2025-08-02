import { useEffect, useState } from 'react'

function SellerView() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const SHEET_URL = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' //google sheet script url

  const fetchOrders = async () => {
    try {
      const res = await fetch(SHEET_URL)
      const data = await res.json()
      setOrders(data)
      setLoading(false)
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', err)
    }
  }

  const handleDelete = async (rowIndex, status) => {
    if (status === 'success') return;

    const res = await fetch(`${SHEET_URL}?rowIndex=${rowIndex}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      alert('ลบออเดอร์แล้ว')
      fetchOrders()
    }
  }

  const handlePaid = async (rowIndex, status) => {
    if (status === 'success') return;

    setOrders(prev =>
      prev.map(order =>
        order.rowIndex === rowIndex ? { ...order, status: 'success' } : order
      )
    )

    const res = await fetch(`${SHEET_URL}?rowIndex=${rowIndex}&status=success`, {
      method: 'PUT',
    })

    if (res.ok) {
      fetchOrders()
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => {
      fetchOrders()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 ออเดอร์ที่ต้องทำ</h1>

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : orders.length === 0 ? (
        <p>ยังไม่มีออเดอร์</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">คิว</th>
              <th className="p-2 border">รายการ</th>
              <th className="p-2 border">ยอดรวม</th>
              <th className="p-2 border">สถานะ</th>
              <th className="p-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border font-semibold text-lg">#{order.queue}</td>
                <td className="p-2 border">
                  {order.items.map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </td>
                <td className="p-2 border">{order.totalText}</td>
                <td className="p-2 border">
                  <span className={order.status === 'success' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {order.status === 'success' ? 'จ่ายแล้ว' : 'รอดำเนินการ'}
                  </span>
                </td>
                <td className="p-2 border">
                  {order.status === 'success' ? (
                    <span className="text-gray-400 italic">✓ เสร็จแล้ว</span>
                  ) : (
                    <>
                      <button
                        className="px-2 py-1 rounded mr-2 text-white bg-green-500 hover:bg-green-600"
                        onClick={() => handlePaid(order.rowIndex, order.status)}
                      >
                        ✅ จ่ายเงินแล้ว
                      </button>
                      <button
                        className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(order.rowIndex, order.status)}
                      >
                        🗑 ลบ
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SellerView
