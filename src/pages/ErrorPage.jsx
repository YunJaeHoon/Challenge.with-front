import { useLocation } from "react-router-dom";

function ErrorPage() {

  const { state } = useLocation();

  return (
    <div>
      <h1>에러가 발생하였습니다.</h1>
      <div>{state?.message}</div>
    </div>
  );
}

export default ErrorPage