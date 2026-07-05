function Loading({ message = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="text-muted mt-2 mb-0">{message}</p>
    </div>
  );
}

export default Loading;