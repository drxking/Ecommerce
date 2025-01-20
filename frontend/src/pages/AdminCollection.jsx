import React,{useState} from 'react'
import AdminNav from '../components/AdminNav'
import AddCollection from '../components/AddCollection'

const AdminCollection = () => {
    const [open, setOpen] = useState(false)

function handleOpen(){
    setOpen(true)
}
function handleClose(){
    setOpen(false)
}
    
  return (
    <div>
        <AddCollection open={open} handleClose={handleClose}/>
        <AdminNav />
        <div className="hero flex justify-between px-10 py-4 ">
        <h2 className="font-semibold text-2xl font-[panchang]  uppercase pl-3">
          Your Collections
        </h2>
        <button
        onClick={handleOpen}
                className="z-20 text-white relative font-semibold overflow-hidden px-3 py-2 rounded-full "
              >
                <img
                  src="/mask2.webp"
                  className="w-full h-full brightness-[85%] -z-10 absolute top-0 left-0"
                />
                Add Collection
              </button>
      </div>
    </div>
  )
}

export default AdminCollection