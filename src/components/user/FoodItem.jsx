function FoodItem({ item, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
      <p className="text-gray-600 mb-4">{item.price} บาท</p>
      <button
        onClick={() => onAdd(item)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        เพิ่มไปยังรายการอาหาร
      </button>
    </div>
  )
}

export default FoodItem
