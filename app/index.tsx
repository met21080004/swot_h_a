import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const Card = ({ children }: { children: any }) => (
  <View style={styles.card}>{children}</View>
);

const Button = ({ onPress, children }: { onPress: () => void, children: any }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

const SWOTAnalysis = () => {
  const [swotData, setSwotData] = useState<any>([]);
  const [totals, setTotals] = useState({ Strengths: 0, Weaknesses: 0, Opportunities: 0, Threats: 0 });
  const [newEntries, setNewEntries] = useState([
    { criteria: "", description: "", score: "", showDropdown: false }
  ]);

  const [popRange, setPopRange] = useState(false)

  const handleEntryChange = (index: number, field: string, value: string) => {
    const updatedEntries: any = [...newEntries];
    updatedEntries[index][field] = value;
    setNewEntries(updatedEntries);
  };

  const handleAddRow = () => {
    setNewEntries([...newEntries, { criteria: "", description: "", score: "", showDropdown: false }]);
  };

  const handleSubmitEntries = () => {
    let updatedData = [...swotData];
    let updatedTotals: any = { ...totals };


    newEntries.forEach(entry => {
      const { criteria, description, score } = entry;
      if (["Strengths", "Weaknesses", "Opportunities", "Threats"].includes(criteria) && description && score) {
        const numericScore = parseFloat(score);
        updatedData.push({ criteria: criteria, description, score: numericScore });
        updatedTotals[criteria] += numericScore;
      }
    });

    console.log(updatedTotals);

    setSwotData(updatedData);
    setTotals(updatedTotals);
    setPopRange(true)
    // setNewEntries([{ criteria: "", description: "", score: "" }]); // reset
  };

  const chartData = {
    labels: ["S", "W", "O", "T"], // Tên các tiêu chí
    datasets: [
      {
        data: [totals.Strengths, totals.Weaknesses, totals.Opportunities, totals.Threats] // Điểm tương ứng
      }
    ]
  };

  const toggleDropdown = (index: number) => {
    const updated = [...newEntries];
    updated[index].showDropdown = !updated[index].showDropdown;
    setNewEntries(updated);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginTop: 40 }}>
        <Text style={styles.title}>SWOT Analysis</Text>
        <View marginH-10>
          {newEntries.map((entry, index) => (
            <Card key={index}>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => toggleDropdown(index)}
              >
                <Text>{entry.criteria || "Chọn tiêu chí (S, W, O, T)"}</Text>
              </TouchableOpacity>

              {entry.showDropdown && (
                <View style={styles.dropdown}>
                  {["Strengths", "Weaknesses", "Opportunities", "Threats"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handleEntryChange(index, 'criteria', item);
                        toggleDropdown(index); // đóng dropdown sau khi chọn
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TextInput
                style={styles.input}
                placeholder="Mô tả"
                value={entry.description}
                onChangeText={(text) => handleEntryChange(index, 'description', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Điểm số"
                keyboardType="numeric"
                value={entry.score}
                onChangeText={(text) => handleEntryChange(index, 'score', text)}
              />
            </Card>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity style={{ width: '49%', backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 10 }} onPress={handleAddRow}>
            <Text style={{ color: 'white' }}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '49%', backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 10 }} onPress={handleSubmitEntries}>
            <Text style={{ color: 'white' }}>Average</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal
        visible={popRange}
        transparent
        animationType="fade"
        onRequestClose={() => setPopRange(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
          <View style={{ alignItems: 'flex-end', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => setPopRange(false)}>
              <AntDesign name="close" size={20} color={'black'} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>Tổng điểm: {(totals.Strengths + totals.Weaknesses + totals.Opportunities + totals.Threats) / 4}</Text>
                <Text>💪 Điểm mạnh (S): {totals.Strengths}</Text>
                <Text>🔻 Điểm yếu (W): {totals.Weaknesses}</Text>
                <Text>🚀 Cơ hội (O): {totals.Opportunities}</Text>
                <Text>⚠️ Thách thức (T): {totals.Threats}</Text>
                <Text style={styles.finalResult}>
                  {totals.Strengths + totals.Opportunities > totals.Weaknesses + totals.Threats
                    ? "Chiến lược khả thi với nhiều lợi thế"
                    : "Cần điều chỉnh để giảm thiểu rủi ro"}
                </Text>
              </View>

              {/* Bar Chart from react-native-chart-kit */}
              <BarChart
                data={chartData}
                width={Dimensions.get("window").width - 32} // Adjust the width of the chart
                height={220}
                fromZero={false}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                  barRadius: 5,
                  useShadowColorFromDataset: false
                }}
                style={styles.chart}
                yAxisLabel="" // Example for adding label
                segments={10}
                yAxisSuffix="" // Example for adding suffix
              />

              {swotData.map((item: any, index: number) => (
                <Card key={index}>
                  <Text style={styles.cardText}><Text style={styles.bold}>{item.criteria}:</Text> {item.description}</Text>
                  <Text style={styles.cardText}><Text style={styles.bold}>Điểm:</Text> {item.score}</Text>
                </Card>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8f9fa", paddingBottom: 50 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10 },
  button: { marginTop: 10, backgroundColor: "#007bff", padding: 14, borderRadius: 30, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  resultContainer: { padding: 16, backgroundColor: "#f0f0f0", borderRadius: 10 },
  resultText: { fontSize: 18, fontWeight: "bold" },
  finalResult: { fontSize: 16, fontWeight: "bold", marginTop: 10, color: "#d9534f" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginVertical: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  cardText: { fontSize: 16 },
  bold: { fontWeight: "bold" },
  chart: { marginTop: 20, borderRadius: 8 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 15
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
});

export default SWOTAnalysis;
