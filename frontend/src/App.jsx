import Card from "./components/Card";
import "./App.css"; // Đừng quên tạo file CSS này.

const App = () => {
  const voters = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Văn C" },
  ];

  return (
    <>
      <div>
        <h1>Hệ thống bầu cử ZKP</h1>
      </div>
      <div className="card-container">
        {voters.map((voter) => (
          <Card key={voter.id} voter={voter} />
        ))}
      </div>
    </>
  );
};

export default App;
