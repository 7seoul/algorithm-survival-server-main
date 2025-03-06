import React, { useState } from 'react';
import { Table, Pagination } from 'antd';
import './RankingPage.css';

const RankingPage = ({ users, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const localMap = {
    1: "서울",
    2: "대전",
    3: "구미",
    4: "광주",
    5: "부울경"
  };

  const columns = [
    {
      title: '순위',
      dataIndex: 'rank',
      key: 'rank',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: '10%',
    },
    {
      title: '티어 & 이름',
      key: 'tierName',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a 
            href={`https://solved.ac/profile/${record.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tier-link"
          >
            <img 
              src={`https://static.solved.ac/tier_small/${record.tier}.svg`}
              alt={`Tier ${record.tier}`}
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
          </a>
          <a
            href={`https://solved.ac/profile/${record.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="name-link"
          >
            <span style={{ fontWeight: 'bold' }}>{record.name}</span>
          </a>
        </div>
      ),
      width: '35%',
    },
    {
      title: '지역',
      dataIndex: 'local',
      key: 'local',
      render: (local) => localMap[local] || local,
      width: '20%',
    },
    {
      title: '점수',
      key: 'score',
      render: (_, record) => record.curCnt - record.startCnt,
      width: '15%',
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortedUsers = [...users].sort((a, b) => (b.curCnt - b.startCnt) - (a.curCnt - a.startCnt));
  const paginatedData = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="ranking-page-container">
      <h1>랭킹</h1>
      <div className="table-wrapper">
        <Table
          columns={columns}
          dataSource={paginatedData}
          loading={loading}
          pagination={false}
          rowKey="handle"
          bordered
        />
        {users.length > 0 && (
          <Pagination
            current={currentPage}
            total={users.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            style={{ marginTop: 16, textAlign: 'center' }}
            showSizeChanger={false}
          />
        )}
      </div>
    </div>
  );
};

export default RankingPage;