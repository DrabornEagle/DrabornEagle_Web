import React from 'react';
import {View} from 'react-native';
export default function MapView({latitude,longitude}:{latitude:number;longitude:number}){const d=.008;const src=`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-d}%2C${latitude-d}%2C${longitude+d}%2C${latitude+d}&layer=mapnik&marker=${latitude}%2C${longitude}`;return <View style={{borderRadius:18,overflow:'hidden',height:240}}>{React.createElement('iframe',{title:'İşletme konumu',src,loading:'lazy',style:{width:'100%',height:240,border:0},referrerPolicy:'no-referrer'})}</View>;}
