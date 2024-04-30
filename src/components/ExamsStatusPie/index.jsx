import { Typography } from "@mui/material";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieRechartComponent = ({nm1, qtdLabel1, nm2, qtdLabel2 = 0, nm3, qtdLabel3 = 0, nm4, qtdLabel4 = 0, nm5, qtdLabel5 = 0, nm6, qtdLabel6 = 0, isSmallScreen, isMidScreen }) => {

  const qtdTotal = qtdLabel1 + qtdLabel2 + qtdLabel3 + qtdLabel4 + qtdLabel5 + qtdLabel6;
  const COLORS = ["#02b2af","#0094FF", "#FF00FE" ,"#b800d8","#DC7900", "#FFA93F"];
  const pieData = [
    {
      name: nm1,
      value: qtdLabel1
    },
    {
      name: nm2,
      value: qtdLabel2
    },
    {
      name: nm3,
      value: qtdLabel3
    },
    {
      name: nm4,
      value: qtdLabel4
    },
    {
      name: nm5,
      value: qtdLabel5
    },
    {
      name: nm6,
      value: qtdLabel6
    },
  ];

  const filteredPieData = pieData.filter((item) => item.value > 0);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
    const percent = (value / qtdTotal) * 100
    if (value == 0 || percent < 2.7) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={'16px'} fontFamily="Rajdhani" fontWeight={'bold'}>
        {`${value}`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const percent = payload[0].value / qtdTotal * 100;
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc"
          }}
        >
          <Typography>{`${payload[0].name} : ${payload[0].value} => %${percent.toFixed(2)}`}</Typography>
        </div>
      );
    }
    return null;
  };
  
  return (
    <ResponsiveContainer width="100%" height={(isSmallScreen==0 && isMidScreen) ? 420 : 300}>
      <PieChart>
        <Pie
          data={filteredPieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={isSmallScreen ? 80 : 120}
          fill="#8884d8"
        >
          {filteredPieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))};
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout='vertical'
          align={isMidScreen ? 'center' : 'right'}
          verticalAlign={isMidScreen ? 'bottom' : 'middle'}
          wrapperStyle={{
            fontFamily: 'Rajdhani',
            fontSize: isSmallScreen ? '1.0rem' : '1.5rem',
            fontWeight: 'bold',
            color: '#FF0000',
            marginRight: isSmallScreen ? 'auto' : 100,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieRechartComponent;