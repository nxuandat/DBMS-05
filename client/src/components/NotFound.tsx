import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

export const Notfound = (props) => {
  return (
    <>
      <Result
        status='404'
        title='404'
        subTitle='Xin lỗi, trang bạn truy cập không tồn tại!'
        extra={
          <Button style={{ backgroundColor: "#2AB178", color: "#ffffff" }}>
            <Link to='/' style={{ textDecoration: "none", color: "inherit" }}>
              Quay về Trang chủ
            </Link>
          </Button>
        }
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Notfound);
