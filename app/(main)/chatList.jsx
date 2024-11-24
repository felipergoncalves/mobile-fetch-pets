import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import ScreenWrapper from '../../components/ScreenWrapper';
import Navigator from '../../components/Navigator';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/Avatar';
import { theme } from '../../constants/theme';

const mockConversations = [
  { id: '1', username: 'Alice' },
  { id: '2', username: 'Bob' },
  { id: '3', username: 'Charlie' }
];

const ChatList = () => {
  const {user, setAuth} = useAuth();
  const router = useRouter();
  const userId = '123'; // ID fictício do usuário atual

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(main)/chatScreen', // Certifique-se de que o caminho está correto
          params: { userId: userId, contactId: item.id, contactName: item.username },
        })
      }
      style={{ padding: 15, flexDirection: "row", gap: 10}}
    >
      <Avatar />
      <View>
        <Text style={{ fontSize: hp(2.3), fontWeight: theme.fonts.medium}}>{item.username}</Text>
        <Text style={{ fontSize: hp(1.7), color: theme.colors.text}}>Última mensagem enviada aqui</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{flex: 1, backgroundColor:"white"}}>
      <ScreenWrapper>
        <View style={{paddingHorizontal: wp(4)}}>
          <View>
            <Header title="Conversas" mb={30}/>
          </View>
          <FlatList
            data={mockConversations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
      </ScreenWrapper>
      <Navigator user={user}/>
    </View>
  );
};

export default ChatList;


// import React from 'react';
// import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Pressable } from 'react-native';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import Navigator from '../../components/Navigator';
// import { useAuth } from '../../contexts/AuthContext';
// import { useRouter } from 'expo-router';

// const mockConversations = [
//   { id: '1', username: 'Alice' },
//   { id: '2', username: 'Bob' },
//   { id: '3', username: 'Charlie' }
// ];

// const ChatList = ({ navigation }) => {

//     const {user, setAuth} = useAuth();
//     const router = useRouter();
//     const userId = '123';

//     const renderItem = ({ item }) => (
//         <Pressable
//           onPress={() =>
//             router.push({
//               pathname: '/chatScreen',
//               params: { userId: userId, contactId: item.id, contactName: item.username },
//             })
//           }
//           style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
//         >
//           <Text style={{ fontSize: 18 }}>{item.username}</Text>
//         </Pressable>
//     );

// //     const renderItem = ({ item }) => (
// //         <TouchableOpacity
// //         onPress={() => navigation.navigate('ChatScreen', { contactId: item.id, contactName: item.username })}
// //         >
// //         <Text style={{ fontSize: 18, padding: 15 }}>{item.username}</Text>
// //         </TouchableOpacity>
// //   );

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <FlatList
//         data={mockConversations}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//       />
//     </View>
//     // <View style={{flex: 1}}>
//     //     <ScrollView>
//     //         <ScreenWrapper>
//     //             <View style={styles.container}>
//     //                 <View style={{ flex: 1, padding: 10 }}>
//     //                     <FlatList
//     //                         data={mockConversations}
//     //                         // keyExtractor={(item) => item.id}
//     //                         renderItem={renderItem}
//     //                     />
//     //                 </View>
//     //             </View>
//     //         </ScreenWrapper>
//     //     </ScrollView>
//     //     <Navigator user={user}/>
//     // </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//     },
// })

// export default ChatList;
