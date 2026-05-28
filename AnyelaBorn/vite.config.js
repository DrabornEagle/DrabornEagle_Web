import { defineConfig as dkd_define_config } from 'vite';
import dkd_react_plugin from '@vitejs/plugin-react';

export default dkd_define_config({
  base: '/AnyelaBorn/',
  plugins: [dkd_react_plugin()],
});
