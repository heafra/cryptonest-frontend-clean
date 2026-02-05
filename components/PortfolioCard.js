export default function PortfolioCard({ title, value }) {

  return (

    <div className="bg-white p-4 rounded shadow mb-4">

      <h2 className="font-bold mb-2">{title}</h2>

      <p>{value}</p>

    </div>

  );

}