import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';

Parse.setAsyncStorage(AsyncStorage);

Parse.initialize(
  'atbbHmqbXemdLNQGaZB7k9isFDmWrowuDxccHRED',
  'BWrrgVYDw5GkjQtS5uASBJNiGg14JYa5l8ENDcK5'
);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;
