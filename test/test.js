import ViewHistory from 'facade/viewhistory';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new ViewHistory({
  position: 'TR',
});

map.addPlugin(mp);

window.map = map;
