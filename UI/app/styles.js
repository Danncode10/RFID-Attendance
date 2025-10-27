import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 5,
  },
  tableHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    textAlign: "center",
  },
  undoContainer: {
  position: "absolute",
  bottom: 20,
  left: 20,
  right: 20,
  backgroundColor: "#333",
  padding: 15,
  borderRadius: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5,
},
deleteButton: {
  backgroundColor: "#ff5252",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
},
deleteButtonText: {
  color: "#fff",
  fontWeight: "bold",
},

});
