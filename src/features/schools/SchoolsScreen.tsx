import { Box, Button, Text } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import { useAppData } from "../../context/AppDataContext";

export default function SchoolsScreen() {
  const { schools, fetchSchools, addSchool } = useAppData();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => fetchSchools(search);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await addSchool({ name, city });
    setName("");
    setCity("");
    setShowForm(false);
  };

  return (
    <Box flex={1} p="$4" bg="$backgroundLight0">
      <Text fontSize="$2xl" fontWeight="$bold" mb="$4">
        Escolas
      </Text>

      <TextInput
        placeholder="Buscar escolas..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        style={styles.input}
      />

      <FlatList
        data={schools}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Box bg="$backgroundLight300" p="$3" mb="$2" rounded="$lg">
            <Text fontWeight="$bold">{item.name}</Text>
            {item.city && (
              <Text fontSize="$sm" mt="$1">
                {item.city}
              </Text>
            )}
          </Box>
        )}
      />

      <Pressable style={styles.fab} onPress={() => setShowForm((v) => !v)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {showForm && (
        <Box style={styles.bottomForm} bg="$backgroundLight100">
          <Text fontWeight="$bold" mb="$2">
            Nova Escola
          </Text>

          <TextInput
            placeholder="Nome da escola"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Cidade"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />

          <Box flexDirection="row" justifyContent="flex-end" mt="$2">
            <Button
              variant="outline"
              mr="$2"
              onPress={() => setShowForm(false)}
            >
              <Text>Cancelar</Text>
            </Button>

            <Button onPress={handleCreate}>
              <Text color="$white">Salvar</Text>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { color: "#fff", fontSize: 32, lineHeight: 32 },
  bottomForm: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
