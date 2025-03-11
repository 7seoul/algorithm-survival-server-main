import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { SyncOutlined } from "@ant-design/icons";

function UserModal({ visible, user, onClose, syncUserData }) {
  const [syncLoading, setSyncLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSync = async () => {
    if (!user) return;

    setSyncLoading(true);
    try {
      await syncUserData(user.handle);
      messageApi.open({
        type: "success",
        content: "동기화가 완료되었습니다.",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "데이터 동기화 실패";
      messageApi.open({
        type: "warning",
        content: errorMessage,
      });
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        centered
        width={400}
      >
        {user && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Button
              type="text"
              onClick={handleSync}
              style={{ position: "absolute", top: 10, left: 10 }}
            >
              <SyncOutlined spin={syncLoading} />
            </Button>
            <img
              alt={user.name}
              src={user.imgSrc}
              style={{
                width: "100%",
                maxWidth: "200px",
                height: "auto",
                marginBottom: "16px",
              }}
              onError={(e) =>
                (e.target.src = "http://localhost:3000/noImage.png")
              }
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`https://static.solved.ac/tier_small/${user.tier}.svg`}
                alt={`Tier ${user.tier}`}
                style={{ width: "24px", height: "24px", marginRight: "2px" }}
              />
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                {user.name}
              </span>
            </div>
            <p style={{ margin: "10px 0", fontSize: "16px", color: "gray" }}>
              {user.localName}
            </p>
            <p style={{ margin: "10px 0", fontSize: "16px" }}>
              점수: {user.curCnt - user.startCnt}
            </p>
            <p style={{ margin: "10px 0", fontSize: "14px", color: "#888" }}>
              {user.bio || "자기소개가 없습니다."}
            </p>
            <Button
              type="primary"
              href={`https://solved.ac/profile/${user.handle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              프로필로 이동
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}

export default UserModal;