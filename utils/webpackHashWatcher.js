/* 
 * 
 */
var timer = 60000;
var evt = document.createEvent('HTMLEvents');
evt.initEvent('webpackHashChange', false, false);
evt.oldArr = [];
evt.newArr = [];
evt.diffArr = [];
var isInit = false;

window.webpackHashManager = function (arr) {
  setTimeout(function () {
    removeScript();
  }, 0);
  evt.oldArr = evt.newArr;
  evt.newArr = arr;

  if (!isInit) {
    isInit = true;
    return false;
  };

  var diffArr = handleChange(evt.oldArr, evt.newArr);
  if (diffArr.length) {
    evt.diffArr = diffArr;
    document.dispatchEvent(evt);
  }
};

function getJs () {
  var script = document.createElement('script');
  script.id = 'webpackHashManagerScript';
  script.src = './webpackHash.js?t=' + (+new Date());
  document.head.appendChild(script);
};

function removeScript () {
  var script = document.getElementById('webpackHashManagerScript');
  script && document.head.removeChild(script);
};

function handleChange (oldArr, newArr) {
  var diffArr = [];
  var oldMap = getMap(oldArr);
  var newMap = getMap(newArr);
  
  for (var i = 0; i < oldArr.length; i++) {
    var name = oldArr[i].name;
    var hash = oldArr[i].hash;
    var mapObj = newMap[name];
    if (!mapObj) {
      diffArr.push(Object.assign({
        diffType: 'delete'
      }, oldArr[i]));
    } else if (hash !== mapObj.hash) {
      diffArr.push(Object.assign({
        diffType: 'change'
      }, oldArr[i]));
    }
  };

  for (var j = 0; j < newArr.length; j++) {
    var name = newArr[j].name;
    var hash = newArr[j].hash;
    var mapObj = oldMap[name];
    if (!mapObj) {
      diffArr.push(Object.assign({
        diffType: 'new'
      }, newArr[j]));
    }
  };

  return diffArr;
};

function getMap (arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i ++) {
    obj[arr[i].name] = arr[i];
  };
  return obj;
}

getJs();
setInterval(function () {
  getJs();
}, timer);
