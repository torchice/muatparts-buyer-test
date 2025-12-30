
import Modal from '@/components/AI/Modal';
import Profileseller from './Profileseller';
import Toast from '@/components/Toast/Toast';

function Page() {
    return (
      <div className="w-full">
        <Modal />
        <Toast />
        <Profileseller />
      </div>
    );
}

export default Page;
