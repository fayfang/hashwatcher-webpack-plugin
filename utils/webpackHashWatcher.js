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
    return
  };

  var diffArr = handleChange(evt.newArr, evt.oldArr);
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
  var diffArr = []

  for (var i = 0; i < oldArr.length; i ++) {
    var name = oldArr[i].name
    var hash = oldArr[i].hash
    for (var j = 0; j < newArr.length; j++) {
      if (newArr[j].name === name && newArr[j].hash !== hash) {
        diffArr.push(newArr[j])
      }
    }
  }

  return diffArr
};

getJs();
setInterval(function () {
  getJs();
}, timer);
