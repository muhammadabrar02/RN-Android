import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'


const settings = () => {
    const [username, setUsername] = useState("")
    const [randomRepoName, setRandomRepoName] = useState("")

    const fetchRepo = () => {
        console.log("fetching repo for user:", username)
        fetch(`https://api.github.com/users/${username}/repos`)
        .then(response=> response.json())
        .then(data=> setRandomRepoName(data[0].name))
        .catch(error=> console.error("Error fetching repos:", error))
    }
    return (
        <View>
            <Text style={styles.container}>settings</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder='Enter your github username'
            />
            <Button
                title="Fetch Repos"
                onPress={fetchRepo}
            >
            </Button>
            <Text
            style={styles.repoName}>RandomRepoName : {randomRepoName}</Text>
          
        </View>
    )
}

export default settings

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    input: {
        width: "80%",
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: '#ffffff'

    },
    repoName: {
        fontSize: 20,
        color: 'black',
        marginTop: 12,
    }    

});