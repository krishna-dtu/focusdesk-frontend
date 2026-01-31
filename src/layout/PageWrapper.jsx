import Navbar from "../components/Navbar";

export default function PageWrapper({ children }) {
  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f8fc",
          padding: "60px 20px",
        }}
      >
        {children}
      </div>
    </>
  );
}
