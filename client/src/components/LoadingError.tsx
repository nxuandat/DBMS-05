import React from "react";
import { Button, Spin, Alert } from "antd";
import HashLoader from "react-spinners/HashLoader";

function LoadingError(props) {
  const { error, retry } = props;

  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
        <Button onClick={retry}>Retry</Button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <HashLoader style={{ position: "absolute", top: "30vh" }} size="20vh" color="#28dc84" />
    </div>
  );
}

export default LoadingError;