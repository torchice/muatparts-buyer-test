import Modal from "@/components/AI/Modal";
import Register from "./Register";
import Toast from "@/components/Toast/Toast";


function Page() {
  return (
    <div className='w-full'>
      <Modal/>
      <Toast/>
      <Register />
    </div>
  );
}

export default Page;
