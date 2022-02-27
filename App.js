import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header, Input, Icon, Button, ListItem } from 'react-native-elements';
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
    if (name === "") {
      return
    }
    let fixedName = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()
    db.transaction(tx => {
      tx.executeSql('insert into Product (Name, Amount) values (?, ?);', [fixedName, amount]);
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

  const renderItem = ({ item }) => {
    return (
      <ListItem bottomDivider rightContent={ <Button
        title="Delete"
        icon={{ name: 'delete', color: 'white' }}
        buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
      />}>
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content right>
          <Icon onPress={() => deleteProduct(item.id)}type="material" name="delete" color="red"/>
        </ListItem.Content>
      </ListItem>
    )
  }


  return (
    <View style={styles.container}>
      <View style={{ paddingBottom: 10 }}>
        <Header
          backgroundColor="grey"
          leftComponent={{ icon: "shopping-cart", color: "white" }}
          centerComponent={{ text: "Shopping List App", style: { color: "white" } }}
          rightComponent={{ icon: "shopping-cart", color: "white" }}
        />
      </View>
      <Input placeholder="Product" label="PRODUCT" value={name} onChangeText={text => setName(text)} />
      <Input placeholder="Amount" value={amount} onChangeText={text => setAmount(text)} label="AMOUNT" />
      <Button raised icon={{ name: "save", type: "material", color: "#fff" }} onPress={saveProduct} title="ADD PRODUCT" />
      <Text style={{ fontSize: 20, marginTop: "5%" }}>Shopping list</Text>
      <View style={{width: "100%", flex: 1}}>
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      </View>
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
    backgroundColor: "lightblue",
    padding: 10,
    width: 200
  },
  input: {
    marginTop: 5,
    marginBottom: 5
  },
});

