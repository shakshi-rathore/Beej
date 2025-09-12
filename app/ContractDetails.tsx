import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

export default function ContractDetails() {
  const { contract } = useLocalSearchParams();
  const parsedContract = JSON.parse(contract || '{}');

  const monthlySales = parsedContract.monthlySales || [];

  // Format data for VictoryBar
  const formattedData = monthlySales.map((value: number, index: number) => ({
    month: `M${index + 1}`,
    sales: value,
  }));

  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{parsedContract.title}</Text>
      <Text>Type: {parsedContract.type}</Text>
      <Text>Status: {parsedContract.status}</Text>
      <Text>Production Promised: {parsedContract.productionPromised}</Text>
      <Text>Assured Return: {parsedContract.assuredReturn}</Text>

      <View style={{ marginVertical: 12 }}>
        <Text style={{ fontWeight: 'bold' }}>Cost Breakdown:</Text>
        {(parsedContract.costBreakdown || []).map((item: string, i: number) => (
          <Text key={i}>• {item}</Text>
        ))}
      </View>

      <View style={{ marginVertical: 12 }}>
        <Text style={{ fontWeight: 'bold' }}>Services Provided:</Text>
        {(parsedContract.servicesProvided || []).map((item: string, i: number) => (
          <Text key={i}>• {item}</Text>
        ))}
      </View>

      <View style={{ marginVertical: 12 }}>
        <Text style={{ fontWeight: 'bold' }}>Farmer Contribution:</Text>
        {(parsedContract.farmerContribution || []).map((item: string, i: number) => (
          <Text key={i}>• {item}</Text>
        ))}
      </View>

      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>📊 Monthly Sales</Text>
        <VictoryChart
          width={Dimensions.get('window').width - 32}
          theme={VictoryTheme.material}
          domainPadding={{ x: 20, y: [0, 20] }}
        >
          <VictoryAxis
            tickFormat={formattedData.map(d => d.month)}
            style={{ tickLabels: { fontSize: 10 } }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `${x}`}
            style={{ tickLabels: { fontSize: 10 } }}
          />
          <VictoryBar
            data={formattedData}
            x="month"
            y="sales"
            style={{ data: { fill: '#4ade80', borderRadius: 4 } }}
            barRatio={0.7}
          />
        </VictoryChart>
      </View>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>📷 Photos</Text>
      <ScrollView horizontal>
        {(parsedContract.photos || []).map((uri: string, i: number) => (
          <Image
            key={i}
            // source={{ uri: `http://192.168.57.191:5000/uploads/${uri}` }}
            source={{ uri:`http://10.173.21.191:5000/uploads/${uri}`}}
            style={{ width: 160, height: 100, marginRight: 10, borderRadius: 8 }}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}
