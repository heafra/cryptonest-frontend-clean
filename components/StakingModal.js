export default function StakingModal({ open, onClose }) {

  if (!open) return null;



  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white p-6 rounded shadow-md">

        <h2 className="font-bold mb-4">Stake Tokens</h2>

        <button

          onClick={onClose}

          className="bg-red-600 text-white p-2 rounded"

        >

          Close

        </button>

      </div>

    </div>

  );

}