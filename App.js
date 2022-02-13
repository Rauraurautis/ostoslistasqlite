import React, { useState, useEffect } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('products.db')

export default function App() {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [products, setProducts] = useState([])

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("create table if not exists Product (id integer primary key not null, name text, amount text');")
    })
    updateList()
  }, [])

  const saveProduct = () => {
    db.transaction(tx => {
      tx.executeSql('insert into Product (Name, Amount) values (?, ?);', [name, amount]);
    }, error => console.log(error), updateList)
    setName("")
    setAmount("")
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from Product;', [], (_, { rows }) => setProducts(rows._array))
    })
  }


  const deleteProduct = (id) => {
    db.transaction(tx => {
      tx.executeSql("delete from Product where id = ?;", [id])
    }, null, updateList)
  }




  return (
    <View style={styles.container}>
      
      <TextInput style={styles.input, {marginTop: 50}} value={name} onChangeText={text => setName(text)} placeholder="Product name" />
      <TextInput style={styles.input} value={amount} onChangeText={text => setAmount(text)} placeholder="Amount" />
      <TouchableOpacity style={styles.button} onPress={saveProduct}>
        <Text>SAVE</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 20, marginTop: "5%"}}>Shopping list</Text>
      <FlatList
        style={{ marginLeft: "5%", marginTop: "5%"}}
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>{item.name}, {item.amount}</Text>
            <Text style={{ fontSize: 18, color: '#0000ff', marginLeft: 5 }} onPress={() => deleteProduct(item.id)}>bought</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  button: {
    alignItems: "center",
    backgroundColor: "#ffc96d",
    padding: 10
  },
  input: {
    marginTop: 5,
    marginBottom: 5
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    
  }
});

