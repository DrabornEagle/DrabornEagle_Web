import React from 'react';
import NativeMap,{Marker} from 'react-native-maps';
export default function MapView({latitude,longitude}:{latitude:number;longitude:number}){return <NativeMap style={{height:240,borderRadius:18}} initialRegion={{latitude,longitude,latitudeDelta:.015,longitudeDelta:.015}}><Marker coordinate={{latitude,longitude}} title="İşletme"/></NativeMap>;}
