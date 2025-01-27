import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

// import socket from '../../utils/socket'

import { ActivityIndicator, Alert, AppState, Button, Clipboard, DeviceEventEmitter, Image, Modal, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {
    MainWindowButtonIcon,
    MainWindowButtonText,
    MainWindowError,
    MainWindowLocalId,
    MainWindowLocalIdText,
    MainWindowRemoteId,
    MainWindowTextInput,
    MainWindowTitle,
    MainWindowView,
    RowContainer,
    ShowButton,
} from "./styled";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Svg} from "../../../../assets/icons";
import { MainWindowProps } from './types';

import * as PhoneContacts from 'react-native-contacts';
import { Contact } from 'react-native-contacts/type';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketContext } from '../../socket/SocketContext';

export const Contacts = ({ startCall, setNickname }: MainWindowProps) => {
  const socket = useContext(SocketContext);

    const [remoteId, setRemoteId] = useState('');
    const [localId, setLocalId] = useState('');
    const [localIdShow, setLocalIdShow] = useState(false);
    const [error, setError] = useState('');

    const [contacts, setContacts] = React.useState<Contact[] | null>(
        null,
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [phoneNumberInput, setPhoneNumberInput] = useState<string>("+38 (");
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [chooseNumber, setChooseNumber] = useState([]);

    const filteredSections = React.useMemo(() => {
      if (!contacts) return null;
  
      const lowercasedQuery = searchQuery.toLowerCase();
  
      const filteredContacts = contacts.filter(contact => {
          const name = `${contact.givenName} ${contact.familyName}`.toLowerCase();
          const phoneNumbers = contact.phoneNumbers.map(phone => phone.number).join(' ').toLowerCase();
          return name.includes(lowercasedQuery) || phoneNumbers.includes(lowercasedQuery);
      });
  
      const sectionsMap = filteredContacts.reduce<Record<string, Contact[]>>(
          (acc, contact) => {
              const { familyName } = contact;
              const [firstLetter] = familyName;
              return Object.assign(acc, {
                  [firstLetter]: [...(acc[firstLetter] || []), contact],
              });
          },
          {}
      );
  
      return Object.entries(sectionsMap)
          .map(([letter, items]) => ({
              letter,
              items: items.sort((a, b) => a.familyName.localeCompare(b.familyName)),
          }))
          .sort((a, b) => a.letter.localeCompare(b.letter));
    }, [contacts, searchQuery]);
    
    useEffect(() => {
        console.log(contacts);
    }, [contacts])

    useEffect(() => {
        if(phoneNumber) {
            console.log('Init Socket signal');
            socket.on('init', ({ id }: any) => {
                console.log(id);
                setLocalId(id);
            });
            socket.emit('init', {phoneNumber: cleanPhoneNumber(phoneNumber)})
        }
    }, [phoneNumber])
    

    useEffect(() => {
        const checkPhoneNumber = async () => {
            try {
              const savedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
              if (!savedPhoneNumber) {
                setModalVisible(true); // Если номера телефона нет, показываем модальное окно
              } else {
                setPhoneNumber(savedPhoneNumber);
                console.log('Сохраненный номер телефона:', savedPhoneNumber);
              }
            } catch (e) {
              console.error('Ошибка при проверке номера телефона:', e);
            }
        };
      
        checkPhoneNumber();

        console.log('useEffect');

        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
              title: 'Contacts',
              message: 'ContactsList app would like to access your contacts.',
              buttonPositive: 'Accept',
            }).then(value => {
              if (value === 'granted') {
                PhoneContacts.default.getAll().then(setContacts)
              }
            });
          } else {
            PhoneContacts.default.getAll().then(setContacts)
          }
    }, [])

    const savePhoneNumber = async () => {
        if(phoneNumberInput) {
            if (phoneNumberInput.trim() === '' || phoneNumberInput.length < 19) {
                Alert.alert('Ошибка', 'Пожалуйста, введите номер телефона.');
                return;
            }
            try {
                await AsyncStorage.setItem('userPhoneNumber', phoneNumberInput);
                Alert.alert('Успешно', 'Номер телефона сохранен.');
                setModalVisible(false);
                setPhoneNumber(phoneNumberInput)
            } catch (e) {
                console.error('Ошибка при сохранении номера телефона:', e);
                Alert.alert('Ошибка', 'Не удалось сохранить номер телефона.');
            }
        }
      };

    const cleanPhoneNumber = (phoneNumber: string) => {
        return phoneNumber.replace(/\D+/g, '');
    };

    const sections = React.useMemo(() => {
        if (!contacts) {
          return null;
        }
      
        const sectionsMap = contacts.reduce<Record<string, Contact[]>>(
          (acc, contact) => {
            const {familyName} = contact;
            const [firstLetter] = familyName;
      
            return Object.assign(acc, {
              [firstLetter]: [...(acc[firstLetter] || []), contact],
            });
          },
          {},
        );
      
        return Object.entries(sectionsMap)
          .map(([letter, items]) => ({
            letter,
            items: items.sort((a, b) => a.familyName.localeCompare(b.familyName)),
          }))
          .sort((a, b) => a.letter.localeCompare(b.letter));
      }, [contacts]);

      if (!sections) {
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <ActivityIndicator />
          </View>
        );
      }

    const callWithVideo = (video: boolean, remoteId: string) => {
        if (!remoteId.trim() || remoteId.length < 5) {
            console.log("error1");
            return setError('Номер друга не валідний');
        }
        
        if (localId === remoteId) {
            console.log("error2");
            return setError("Ви не можете подзвонити до себе!");
        }

        const config = { audio: true, video: false }
        startCall(true, cleanPhoneNumber(remoteId), config);
    }

    const onLocalIdPress = () => {
        Clipboard.setString(localId);
        setLocalIdShow(!localIdShow);
    };
      
    const handlePhoneNumberChange = (text: string) => {
        // Удаляем все пробелы и нецифровые символы
        let cleaned = text.replace(/\D+/g, '');

        // Добавляем "+38 (" если очищенный текст меньше чем 3 символа, чтобы пользователю не приходилось вводить код страны
        if (!text.startsWith('+38 (')) {
            cleaned = '';
        }
    
        // Ограничиваем максимальную длину номера до 12 цифр (Украинский номер: 380XXXXXXXXX)
        if (cleaned.length > 12) {
          cleaned = cleaned.slice(0, 12);
        }
    
        // Форматируем номер: +38 (0XX) XXX-XX-XX
        let formattedNumber = '+38 (';
    
        if (cleaned.length > 2) {
            formattedNumber += cleaned.slice(2, 5);
          }
          if (cleaned.length >= 6) {
            formattedNumber += ') ' + cleaned.slice(5, 8);
          }
          if (cleaned.length >= 9) {
            formattedNumber += '-' + cleaned.slice(8, 10);
          }
          if (cleaned.length >= 11) {
            formattedNumber += '-' + cleaned.slice(10, 12);
          }
    
        setPhoneNumberInput(formattedNumber);
    };

    const handleCallClick = (phoneNumbers: any) => {
      if (phoneNumbers.length === 0) return;

      if (phoneNumbers.length === 1) callWithVideo(false, phoneNumbers[0].number);
      else {
        setChooseNumber(phoneNumbers);
      }

    }

    return (
        <SafeAreaView style={{height: '100%'}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Модальне вікно закрито');
                }}
                style={{
                  backgroundColor: "black"
                }}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Введите ваш номер телефона</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Номер телефону"
                    keyboardType="phone-pad"
                    value={phoneNumberInput}
                    placeholderTextColor="#aaa"
                    onChangeText={handlePhoneNumberChange} // Обработчик для форматирования номера
                    maxLength={19}
                    />
                    <Button title="Зберегти" onPress={savePhoneNumber} />
                </View>
                </View>
            </Modal>

            {
              chooseNumber.length > 0 && 
              <Modal
                animationType="slide"
                transparent={true}
                visible={chooseNumber.length > 0}
                onRequestClose={() => {
                  setChooseNumber([]);
                }}
                style={{
                  backgroundColor: "black"
                }}
            >
                <View style={styles.modalContainer}>
                  <View style={styles.modalView}>
                    {
                      chooseNumber.map((item: any) => (
                        <TouchableOpacity
                        style={{paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#3d3d3d', width: 200, borderRadius: 10, marginBottom: 10}}
                        onPress={() => {
                          setChooseNumber([]);
                          callWithVideo(false, item.number)
                        }} key={item.number}>
                          <Text style={{color: 'white'}}>{item.number}</Text>
                        </TouchableOpacity>
                      ))
                    }
                    <TouchableOpacity style={{width: '100%', marginTop: 20}} onPress={() => setChooseNumber([])}>
                      <Text style={{textAlign: 'center', color: 'red'}}>Назад</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>
            }

        <ScrollView>
            <Text style={styles.title}>Контакти</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Пошук за іменем або номером"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {filteredSections && filteredSections.length > 0 ? (
              filteredSections.map(({ letter, items }) => (
                  <View style={styles.section} key={letter}>
                      <Text style={styles.sectionTitle}>{letter}</Text>
                      <View style={styles.sectionItems}>
                      {items.map(({ givenName, familyName, phoneNumbers, thumbnailPath }, index) => {
    const name = `${givenName} ${familyName}`;
    const img = thumbnailPath;

    return (
        <View key={index} style={styles.cardWrapper}>
            <TouchableOpacity onPress={() => handleCallClick(phoneNumbers)}>
                <View style={styles.card}>
                    {img ? (
                        <Image
                            alt=""
                            resizeMode="cover"
                            source={{ uri: img }}
                            style={styles.cardImg}
                        />
                    ) : (
                        <View style={[styles.cardImg, styles.cardAvatar]}>
                            <Text style={styles.cardAvatarText}>{name[0]}</Text>
                        </View>
                    )}
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>{name}</Text>

                        {/* Відображення всіх номерів */}
                        {phoneNumbers.map((phone, phoneIndex) => (
                            <Text key={phoneIndex} style={styles.cardPhone}>
                                {phone.label ? `${phone.label}: ` : ''}{phone.number}
                            </Text>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
})}
                      </View>
                  </View>
              ))
          ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Контактів не знайдено</Text>
              </View>
          )}
        </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
      },
      section: {
        marginTop: 12,
        paddingLeft: 24,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
      },
      sectionItems: {
        marginTop: 8,
      },
      container: {
        paddingVertical: 24,
        paddingHorizontal: 0,
      },
      title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
        marginBottom: 12,
        paddingLeft: 24,
      },
      card: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      cardWrapper: {
        borderBottomWidth: 1,
        borderColor: '#d6d6d6',
      },
      cardImg: {
        width: 42,
        height: 42,
        borderRadius: 12,
      },
      cardAvatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9ca1ac',
      },
      cardAvatarText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff',
      },
      cardBody: {
        marginRight: 'auto',
        marginLeft: 12,
      },
      cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
      },
      cardPhone: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '500',
        color: '#616d79',
        marginTop: 3,
      },
      cardAction: {
        paddingRight: 16,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // затемненный фон
      },
      modalView: {
        width: 300,
        padding: 20,
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
      },
      input: {
        width: '100%',
        height: 40,
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: '#fff',
      },
      searchInput: {
        height: 40,
        marginHorizontal: 24,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5',
        color: '#000',
    },
});