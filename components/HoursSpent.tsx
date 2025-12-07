import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface HoursData {
  [key: string]: number;
}

interface HoursSpentProps {
  data?: HoursData;
  colors?: string[];
  title?: string;
}

const HoursSpent: React.FC<HoursSpentProps> = ({ 
  data = { test: 30, onlineVideo: 30, library: 30 , Reading:30, Practice:30, Others:30},
  colors = ['#A155B9', '#F765A3', '#16BFD6', '#4CAF50', '#FF9800', '#2196F3'],
  title = "Learning graphs"
}) => {
  const totalHours = Object.values(data).reduce((sum, hours) => sum + hours, 0);
  
  const generateConicGradient = () => {
    if (totalHours === 0) {
      return '#e0e0e0';
    }

    let currentPercent = 0;
    const gradientStops = Object.entries(data).map(([key, value], index) => {
      const percent = (value / totalHours) * 100;
      const color = colors[index % colors.length];
      const start = currentPercent;
      const end = currentPercent + percent;
      currentPercent = end;
      
      return `${color} ${start}% ${end}%`;
    });

    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
        }
        .pie-chart {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: ${generateConicGradient()};
        }
    </style>
</head>
<body>
    <div class="pie-chart"></div>
</body>
</html>`;
  const legendData = Object.entries(data).map(([key, value], index) => ({
    name: key.split(/(?=[A-Z])/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' '),
    color: colors[index % colors.length],
    hours: value,
    percentage: totalHours > 0 ? ((value / totalHours) * 100).toFixed(1) : '0'
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.chartWrapper}>
          <WebView
            source={{ html: htmlContent }}
            style={styles.webview}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.legendSection}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.totalHours}>{totalHours} Hrs</Text>
          
          <View style={styles.legendList}>
            {legendData.map((item, index) => (
              <View key={index} style={styles.legendRow}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>
                  {item.name} ({item.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    width: 380,
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartWrapper: {
    width: 140,
    height: 140,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
  },
  legendSection: {
    flex: 1,
    marginLeft: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  totalHours: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  legendList: {
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});

export default HoursSpent;