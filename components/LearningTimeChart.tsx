import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface MonthlyData {
  month: string;
  groupTuition: number;
  selfLearning: number;
}

interface LearningTimeChartProps {
  data?: MonthlyData[];
}

const LearningTimeChart: React.FC<LearningTimeChartProps> = ({ 
  data = [
    { month: 'Jan', groupTuition: 20, selfLearning: 15 },
    { month: 'Feb', groupTuition: 25, selfLearning: 18 },
    { month: 'Mar', groupTuition: 30, selfLearning: 22 },
    { month: 'Apr', groupTuition: 18, selfLearning: 25 },
    { month: 'May', groupTuition: 35, selfLearning: 20 },
    { month: 'Jun', groupTuition: 28, selfLearning: 30 },
    { month: 'Jul', groupTuition: 32, selfLearning: 28 },
    { month: 'Aug', groupTuition: 40, selfLearning: 35 },
    { month: 'Sep', groupTuition: 38, selfLearning: 32 },
    { month: 'Oct', groupTuition: 45, selfLearning: 40 },
    { month: 'Nov', groupTuition: 42, selfLearning: 38 },
    { month: 'Dec', groupTuition: 50, selfLearning: 45 },
  ]
}) => {
  const maxHours = Math.max(...data.flatMap(d => [d.groupTuition, d.selfLearning]));
  const chartHeight = 200;
  const barWidth = 20;
  const monthSpacing = 50;
  const totalWidth = data.length * monthSpacing;

  const getBarHeight = (hours: number) => (hours / maxHours) * chartHeight;
  const getLineY = (hours: number) => chartHeight - getBarHeight(hours);

  // Create smooth line path
  const renderLineGraph = () => {
    return data.map((item, index) => {
      if (index === data.length - 1) return null;

      const currentX = (index * monthSpacing) + (monthSpacing / 2);
      const nextX = ((index + 1) * monthSpacing) + (monthSpacing / 2);
      const currentY = getLineY(item.selfLearning);
      const nextY = getLineY(data[index + 1].selfLearning);

      // Calculate line properties
      const distance = Math.sqrt(Math.pow(nextX - currentX, 2) + Math.pow(nextY - currentY, 2));
      const angle = Math.atan2(nextY - currentY, nextX - currentX) * (180 / Math.PI);

      return (
        <View
          key={`line-${item.month}-${data[index + 1].month}`}
          style={[
            styles.lineSegment,
            {
              width: distance,
              left: currentX,
              top: currentY,
              transform: [{ rotate: `${angle}deg` }],
            }
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Time Analysis</Text>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#16423C' }]} />
          <Text style={styles.legendText}>Group Tuition</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]} />
          <Text style={styles.legendText}>Self Learning</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.chartWrapper}>
          {/* Y-axis labels */}
          <View style={styles.yAxisContainer}>
            {[0, Math.floor(maxHours/4), Math.floor(maxHours/2), Math.floor(3*maxHours/4), maxHours].reverse().map((value) => (
              <View key={value} style={styles.yAxisLabel}>
                <Text style={styles.yAxisText}>{value}h</Text>
              </View>
            ))}
          </View>

          <View style={styles.mainChartContainer}>
            {/* Chart area with bars and lines */}
            <View style={[styles.chartArea, { height: chartHeight, width: totalWidth }]}>
              {/* Grid lines */}
              {[0, Math.floor(maxHours/4), Math.floor(maxHours/2), Math.floor(3*maxHours/4), maxHours].map((value) => (
                <View 
                  key={value}
                  style={[
                    styles.gridLine, 
                    { bottom: getBarHeight(value) }
                  ]} 
                />
              ))}

              {/* Line graph - rendered first so bars appear on top */}
              <View style={styles.lineContainer}>
                {renderLineGraph()}
              </View>

              {/* Bars and line points */}
              {data.map((item, index) => (
                <View key={`month-${item.month}`} style={[styles.monthContainer, { left: index * monthSpacing }]}>
                  {/* Bar for group tuition */}
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: getBarHeight(item.groupTuition),
                        backgroundColor: '#16423C',
                        width: barWidth,
                      }
                    ]} 
                  />
                  
                  {/* Line point for self learning */}
                  <View 
                    style={[
                      styles.linePoint,
                      { 
                        top: getLineY(item.selfLearning) - 4,
                        left: (monthSpacing / 2) - 4,
                      }
                    ]} 
                  />
                </View>
              ))}
            </View>

            {/* X-axis labels - Fixed positioning */}
            <View style={[styles.xAxisContainer, { width: totalWidth }]}>
              {data.map((item, index) => (
                <View key={`x-axis-${item.month}`} style={[styles.xAxisLabel, { width: monthSpacing }]}>
                  <Text style={styles.xAxisText}>{item.month}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  scrollContent: {
    paddingRight: 20,
  },
  chartWrapper: {
    flexDirection: 'row',
    minHeight: 250, // Increased to accommodate x-axis labels
  },
  yAxisContainer: {
    width: 40,
    height: 200,
    justifyContent: 'space-between',
    paddingRight: 10,
    marginTop: 10,
  },
  yAxisLabel: {
    height: 40,
    justifyContent: 'center',
  },
  yAxisText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  mainChartContainer: {
    flex: 1,
    position: 'relative',
  },
  chartArea: {
    position: 'relative',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 10,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  monthContainer: {
    position: 'absolute',
    width: 50, // monthSpacing
    height: '100%',
    alignItems: 'center',
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  linePoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 3,
  },
  lineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#4ECDC4',
    transformOrigin: '0 0',
    zIndex: 2,
  },
  xAxisContainer: {
    height: 30,
    flexDirection: 'row',
    marginTop: 5, // Space between chart and labels
  },
  xAxisLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  xAxisText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
});

export default LearningTimeChart;