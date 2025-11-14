import { MaterialIcons } from "@expo/vector-icons";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { Picker } from "@react-native-picker/picker";
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
import type { ClassEntity, School } from "../../types/domain";

export default function ClassesScreen() {
  const {
    classesList,
    fetchClasses,
    addClass,
    schools,
    fetchSchools,
    updateClass,
    deleteClass,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [turno, setTurno] = useState<string>("");
  const [anoLetivo, setAnoLetivo] = useState<string>("");

  const [editingClass, setEditingClass] = useState<ClassEntity | null>(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const translateY = useRef(new Animated.Value(220)).current;

  const numColumns = useResponsiveColumns();

  useEffect(() => {
    fetchClasses();
    fetchSchools();
  }, [fetchClasses, fetchSchools]);

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
    setEditingClass(null);
    setName("");
    setSelectedSchoolId("");
    setTurno("");
    setAnoLetivo("");
    openForm();
  };

  const handleSearch = () => {
    fetchClasses(search);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !selectedSchoolId || !turno || !anoLetivo) return;

    const parsedAno = Number(anoLetivo) as ClassEntity["anoLetivo"];
    const parsedTurno = turno as ClassEntity["turno"];

    if (editingClass) {
      updateClass(editingClass.id, {
        name,
        schoolId: Number(selectedSchoolId),
        turno: parsedTurno,
        anoLetivo: parsedAno,
      });
    } else {
      await addClass({
        name,
        schoolId: Number(selectedSchoolId),
        turno: parsedTurno,
        anoLetivo: parsedAno,
      });
    }

    setName("");
    setSelectedSchoolId("");
    setTurno("");
    setAnoLetivo("");
    setEditingClass(null);
    closeForm();
  };

  const getSchoolName = (schoolId?: number | string) => {
    const school = schools.find(
      (s: School) => String(s.id) === String(schoolId)
    );
    return school?.name ?? "Escola não encontrada";
  };

  const renderItem = ({ item }: { item: ClassEntity }) => {
    const schoolName = getSchoolName(item.schoolId);

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
            <Text fontSize="$sm" mt="$1" color="$emerald800">
              Escola: {schoolName}
            </Text>
            <Text fontSize="$xs" mt="$1" color="$emerald800">
              Turno: {item.turno} • Ano letivo: {item.anoLetivo}
            </Text>
          </Box>

          <Box flexDirection="row">
            <Pressable
              onPress={() => {
                setEditingClass(item);
                setName(item.name);
                setSelectedSchoolId(String(item.schoolId ?? ""));
                setTurno(item.turno);
                setAnoLetivo(String(item.anoLetivo));
                openForm();
              }}
              style={{ padding: 4, marginRight: 4 }}
            >
              <MaterialIcons name="edit" size={20} color="#2E7D32" />
            </Pressable>

            <Pressable
              onPress={() => {
                Alert.alert(
                  "Excluir turma",
                  "Tem certeza que deseja excluir esta turma?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Excluir",
                      style: "destructive",
                      onPress: () => deleteClass(item.id),
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
      <ScreenHeader title="Turmas" />

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
        renderItem={renderItem}
      />

      <FloatingActionButton onPress={openFormForCreate} />

      {isFormVisible && (
        <Animated.View
          style={[styles.bottomForm, { transform: [{ translateY }] }]}
        >
          <Box flex={1}>
            <Text fontWeight="$bold" mb="$2" fontSize="$md" color="$emerald700">
              {editingClass ? "Editar Turma" : "Nova Turma"}
            </Text>

            <TextInput
              placeholder="Nome da turma"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            {/* Escola */}
            <Box mt="$1" mb="$2">
              <Text fontSize="$xs" mb="$1" color="$emerald700">
                Escola
              </Text>
              <Box
                borderWidth={1}
                borderColor="$emerald400"
                borderRadius="$lg"
                overflow="hidden"
                bg="$backgroundLight0"
              >
                <Picker
                  selectedValue={selectedSchoolId}
                  onValueChange={(value) => setSelectedSchoolId(String(value))}
                >
                  <Picker.Item value="" label="Selecione uma escola" />
                  {schools.map((school: School) => (
                    <Picker.Item
                      key={school.id}
                      label={school.name}
                      value={String(school.id)}
                    />
                  ))}
                </Picker>
              </Box>
            </Box>

            {/* Turno */}
            <Box mt="$1" mb="$2">
              <Text fontSize="$xs" mb="$1" color="$emerald700">
                Turno
              </Text>
              <Box
                borderWidth={1}
                borderColor="$emerald400"
                borderRadius="$lg"
                overflow="hidden"
                bg="$backgroundLight0"
              >
                <Picker
                  selectedValue={turno}
                  onValueChange={(value) => setTurno(String(value))}
                >
                  <Picker.Item value="" label="Selecione o turno" />
                  <Picker.Item value="Manhã" label="Manhã" />
                  <Picker.Item value="Tarde" label="Tarde" />
                  <Picker.Item value="Noite" label="Noite" />
                </Picker>
              </Box>
            </Box>

            <Box mt="$1" mb="$2">
              <Text fontSize="$xs" mb="$1" color="$emerald700">
                Ano letivo
              </Text>
              <Box
                borderWidth={1}
                borderColor="$emerald400"
                borderRadius="$lg"
                overflow="hidden"
                bg="$backgroundLight0"
              >
                <Picker
                  selectedValue={anoLetivo}
                  onValueChange={(value) => setAnoLetivo(String(value))}
                >
                  <Picker.Item value="" label="Selecione o ano" />
                  <Picker.Item value="2025" label="2025" />
                  <Picker.Item value="2026" label="2026" />
                  <Picker.Item value="2027" label="2027" />
                  <Picker.Item value="2028" label="2028" />
                </Picker>
              </Box>
            </Box>

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
