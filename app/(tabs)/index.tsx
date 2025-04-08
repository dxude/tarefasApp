import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Parse from '../parseConfig'; 

type Tarefa = {
  objectId: string;
  descricao: string;
  concluida: boolean;
};

export default function Home() {
  const [descricao, setDescricao] = useState('');
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  const buscarTarefas = async () => {
    const Tarefa = Parse.Object.extend('Tarefa');
    const query = new Parse.Query(Tarefa);

    try {
      const resultados = await query.find();
      const tarefasFormatadas = resultados.map((tarefa: any) => ({
        objectId: tarefa.id,
        descricao: tarefa.get('descricao'),
        concluida: tarefa.get('concluida'),
      }));
      setTarefas(tarefasFormatadas);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const adicionarTarefa = async () => {
    if (!descricao.trim()) return;

    const Tarefa = Parse.Object.extend('Tarefa');
    const novaTarefa = new Tarefa();

    novaTarefa.set('descricao', descricao);
    novaTarefa.set('concluida', false);

    try {
      await novaTarefa.save();
      setDescricao('');
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const marcarComoConcluida = async (id: string) => {
    const Tarefa = Parse.Object.extend('Tarefa');
    const query = new Parse.Query(Tarefa);

    try {
      const tarefa = await query.get(id);
      tarefa.set('concluida', !tarefa.get('concluida'));
      await tarefa.save();
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const excluirTarefa = async (id: string) => {
    const Tarefa = Parse.Object.extend('Tarefa');
    const query = new Parse.Query(Tarefa);

    try {
      const tarefa = await query.get(id);
      await tarefa.destroy();
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite uma nova tarefa"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
        />
        <Button title="Adicionar" onPress={adicionarTarefa} />
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={item.concluida ? styles.concluida : styles.pendente}>
              {item.descricao}
            </Text>
            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => marcarComoConcluida(item.objectId)}>
                <Text style={styles.botao}>
                  {item.concluida ? 'Desfazer' : 'Concluir'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirTarefa(item.objectId)}>
                <Text style={[styles.botao, { color: 'red' }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  item: { marginBottom: 12, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 6 },
  pendente: { fontSize: 16, color: '#333' },
  concluida: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  botao: { fontSize: 14, color: '#007bff' },
});
