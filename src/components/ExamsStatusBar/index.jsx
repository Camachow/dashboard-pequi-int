import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExamsStatusBar = ({label1, qtdLabel1=0, label2, qtdLabel2=0,label3, qtdLabel3=0,label4, qtdLabel4=0, isSmallScreen}) => {
    const data = [
      { category: label4, value: qtdLabel4},
      { category: label2, value: qtdLabel2 },
      { category: label3, value: qtdLabel3 },
      { category: label1, value: qtdLabel1 }
      ];

      const filteredData = data.filter((item) => item.value > 0);

  return (
    <ResponsiveContainer height={300} width="100%">
      <BarChart data={filteredData} margin={{right: 60, left:0}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" fontSize={isSmallScreen ? '12px' : '18px'} fontFamily='Rajdhani' fontWeight={'bold'}/>
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExamsStatusBar;