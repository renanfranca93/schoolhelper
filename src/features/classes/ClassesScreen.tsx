import { Box, Button, Text } from "@gluestack-ui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useAppData } from "../../context/AppDataContext";

export default function ClassesScreen() {
  const { classesList, fetchClasses, addClass } = useAppData();

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [schoolId, setSchoolId] = useState("");

  const [isFormVisible, setIsFormVisible] = useState(false);
  const translateY = useRef(new Animated.Value(220)).current;

  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchClasses();
  }, []);

  let numColumns = 1;
  if (width >= 900) {
    numColumns = 3;
  } else if (width >= 600) {
    numColumns = 2;
  }

  const openForm = () => {
    setIsFormVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeForm = () => {
    Animated.timing(translateY, {
      toValue: 220,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsFormVisible(false));
  };

  const handleSearch = () => {
    fetchClasses(search);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await addClass({ name, schoolId });
    setName("");
    setSchoolId("");
    closeForm();
  };

  return (
    <Box flex={1} bg="$backgroundLight0" p="$4">
      <Text fontSize="$3xl" fontWeight="$bold" mb="$3" color="$emerald600">
        Turmas
      </Text>

      <TextInput
        placeholder="Buscar turmas..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        style={styles.input}
      />

      <FlatList
        data={classesList}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Box style={styles.card}>
            <Text fontWeight="$bold" fontSize="$md" color="$emerald700">
              {item.name}
            </Text>

            {item.schoolName ? (
              <Text fontSize="$sm" mt="$1" color="$emerald800">
                Escola: {item.schoolName}
              </Text>
            ) : null}

            {item.schoolId ? (
              <Text fontSize="$xs" mt="$1" color="$emerald700">
                ID da escola: {item.schoolId}
              </Text>
            ) : null}
          </Box>
        )}
      />

      <Pressable style={styles.fab} onPress={openForm}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      {isFormVisible && (
        <Animated.View
          style={[styles.bottomForm, { transform: [{ translateY }] }]}
        >
          <Box flex={1}>
            <Text fontWeight="$bold" mb="$2" fontSize="$md" color="$emerald700">
              Nova Turma
            </Text>

            <TextInput
              placeholder="Nome da turma"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="ID da escola (opcional)"
              value={schoolId}
              onChangeText={setSchoolId}
              style={styles.input}
            />

            <Box flexDirection="row" justifyContent="flex-end" mt="$2">
              <Button
                variant="outline"
                mr="$2"
                onPress={closeForm}
                bg="$backgroundLight0"
                borderColor="$emerald500"
              >
                <Text color="$emerald700">Cancelar</Text>
              </Button>
              <Button bg="$emerald600" onPress={handleCreate}>
                <Text color="$white">Salvar</Text>
              </Button>
            </Box>
          </Box>
        </Animated.View>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#A5D6A7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#F1F8E9",
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 30,
  },
  bottomForm: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F9FFF9",
    borderTopWidth: 1,
    borderColor: "#C8E6C9",
  },
});
