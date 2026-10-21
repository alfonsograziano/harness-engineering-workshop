export function ErrorMessage({ error }: { error: Error }) {
  return (
    <div className="error-message" role="alert">
      {error.message}
    </div>
  );
}
