export default function Loading() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading OSMO Creation">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        OSMO Creation
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
