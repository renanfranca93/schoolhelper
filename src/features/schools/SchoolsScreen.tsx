import { MaterialIcons } from "@expo/vector-icons";
import { Box, Button, Text } from "@gluestack-ui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { FloatingActionButton } from "../../../components/FloatingActionButton";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { useAppData } from "../../context/AppDataContext";
import { useResponsiveColumns } from "../../hooks/useResponsiveColumns";
import type { School } from "../../types/domain";

export default function SchoolsScreen() {
  const { schools, fetchSchools, addSchool, deleteSchool, updateSchool } =
    useAppData();

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const translateY = useRef(new Animated.Value(220)).current;

  const numColumns = useResponsiveColumns();

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

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

  const openFormForCreate = () => {
    setEditingSchool(null);
    setName("");
    setAddress("");
    openForm();
  };

  const handleSearch = () => {
    fetchSchools(search);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editingSchool) {
      updateSchool(editingSchool.id, { name, address });
    } else {
      await addSchool({ name, address });
    }

    setName("");
    setAddress("");
    setEditingSchool(null);
    closeForm();
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
            {item.address ? (
              <Text fontSize="$sm" mt="$1" color="$emerald800">
                {item.address}
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
                setAddress(item.address ?? "");
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
      <ScreenHeader title="Escolas" />

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

      <FloatingActionButton onPress={openFormForCreate} />

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
              placeholder="Endereço"
              value={address}
              onChangeText={setAddress}
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
