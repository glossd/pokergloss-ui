import React from "react";
import {connect} from "react-redux";

function BackendErrorMessage({backendError}) {
  return (
    <div>{backendError}</div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  return { backendError: tableWS.backendError };
};

export default connect(mapStateToProps)(BackendErrorMessage)