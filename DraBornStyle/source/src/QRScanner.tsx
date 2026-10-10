import React from 'react';
import {View} from 'react-native';
import {CameraView,useCameraPermissions} from 'expo-camera';
import {Button,Stack,T} from './ui';
export function QRScanner({onScan}:{onScan:(token:string)=>void}){const [permission,request]=useCameraPermissions();if(!permission?.granted)return <Stack><T>İşletmeye gelen müşterinin süreli QR kodunu okumak için kamera izni gerekli.</T><Button title="Kamera izni ver" onPress={()=>void request()}/></Stack>;return <View style={{height:280,borderRadius:18,overflow:'hidden'}}><CameraView style={{flex:1}} facing="back" barcodeScannerSettings={{barcodeTypes:['qr']}} onBarcodeScanned={r=>{if(r.data.startsWith('dbstyle:'))onScan(r.data.slice(8));}}/></View>;}
