import { MaterialIcons } from "@expo/vector-icons";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useAppData } from "../../context/AppDataContext";
import type { School } from "../../types/domain";

export default function SchoolsScreen() {
  const { schools, fetchSchools, addSchool, deleteSchool, updateSchool } =
    useAppData();

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const translateY = useRef(new Animated.Value(220)).current;

  const { width } = useWindowDimensions();

  // ✅ Garante que as escolas sejam carregadas quando a tela montar
  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

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
    fetchSchools(search);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editingSchool) {
      updateSchool(editingSchool.id, { name, city });
    } else {
      await addSchool({ name, city });
    }

    setName("");
    setCity("");
    setEditingSchool(null);
    closeForm();
  };

  const openFormForCreate = () => {
    setEditingSchool(null);
    setName("");
    setCity("");
    openForm();
  };

  const renderItem = ({ item }: { item: School }) => {
    const classCount = item.classIds ? item.classIds.length : 0;

    return (
      <Box style={styles.card}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1} mr="$2">
            <Text fontWeight="$bold" fontSize="$md" color="$emerald700">
              {item.name}
            </Text>
            {item.city ? (
              <Text fontSize="$sm" mt="$1" color="$emerald800">
                {item.city}
              </Text>
            ) : null}
            <Text fontSize="$xs" mt="$2" color="$emerald700">
              Número de turmas: <Text fontWeight="$bold">{classCount}</Text>
            </Text>
          </Box>

          <Box flexDirection="row">
            <Pressable
              onPress={() => {
                setEditingSchool(item);
                setName(item.name);
                setCity(item.city ?? "");
                openForm();
              }}
              style={{ padding: 4, marginRight: 4 }}
            >
              <MaterialIcons name="edit" size={20} color="#2E7D32" />
            </Pressable>

            <Pressable
              onPress={() => {
                Alert.alert(
                  "Excluir escola",
                  "Tem certeza que deseja excluir esta escola?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Excluir",
                      style: "destructive",
                      onPress: () => deleteSchool(item.id),
                    },
                  ]
                );
              }}
              style={{ padding: 4 }}
            >
              <MaterialIcons name="delete" size={20} color="#C62828" />
            </Pressable>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1} bg="$backgroundLight0" p="$4">
      {/* Header com badge + título menor */}
      <Box
        mt="$6"
        mb="$4"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* badge à esquerda */}
        <LinearGradient
          colors={["#2E7D32", "#66BB6A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badgeOuter}
        >
          <Box
            bg="$backgroundLight0"
            borderRadius={999}
            px="$3"
            py="$1"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="$xs" fontWeight="$semibold" color="$emerald700">
              school helper
            </Text>
          </Box>
        </LinearGradient>

        {/* título menor à direita */}
        <Text fontSize="$lg" fontWeight="$bold" color="$emerald700">
          Escolas
        </Text>
      </Box>

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
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={renderItem}
      />

      <Pressable style={styles.fab} onPress={openFormForCreate}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      {isFormVisible && (
        <Animated.View
          style={[styles.bottomForm, { transform: [{ translateY }] }]}
        >
          <Box flex={1}>
            <Text fontWeight="$bold" mb="$2" fontSize="$md" color="$emerald700">
              {editingSchool ? "Editar Escola" : "Nova Escola"}
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
                onPress={closeForm}
                bg="$backgroundLight0"
                borderColor="$emerald500"
              >
                <Text color="$emerald700">Cancelar</Text>
              </Button>
              <Button bg="$emerald600" onPress={handleSubmit}>
                <Text color="#FFFFFF">Salvar</Text>
              </Button>
            </Box>
          </Box>
        </Animated.View>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  badgeOuter: {
    borderRadius: 999,
    padding: 2,
    alignSelf: "flex-start",
  },
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
