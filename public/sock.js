var socket = io.connect();
var usersLoader = document.getElementById('users-preloader')
socket.emit('iamhere', document.getElementById('name').value);
socket.on('new message', function (data) {
  var div = document.getElementById('messages')
  var id = new Date().getTime();
  div.innerHTML += makeChatRow(data);
  setTimeout(div.scrollTop = div.scrollHeight, 1);
});
socket.on('history', function(data) {
  var div = document.getElementById('messages');
  div.innerHTML = null
  for (var i = 0, len = data.length; i < len; i++) {
    div.innerHTML += makeChatRow(data[i])
  }
  // Scroll to bottom
  setTimeout(div.scrollTop = div.scrollHeight, 1);
});
socket.on('whoshere', function(data) {
  append = [];
  for (var i in data.users) {
    append.push('<li class="collection-item online-user"><a class="user grey-text text-darken-3" href="/user/' + data.users[i].id + '"><i class="material-icons">account_circle</i><span>' + data.users[i].name + '</span></a><span class="new badge" data-badge-caption="online"></span></li>');
  }
  append.unshift('<li class="collection-item online-user"><strong>Online ('+append.length+')</strong></li>')
  document.getElementById('users').innerHTML = append.join('');
  if(!usersLoader.style.display) {
    usersLoader.style.display = 'none'
  }
});
document.getElementById('sendmessage').addEventListener('submit', function(e) {
  var data = {
    'name': document.getElementById('name').value,
    'message': document.getElementById('message').value
  }
  socket.emit('message', data);
  e.preventDefault();
  document.getElementById('message').value = '';
  return false;
});

var makeChatRow = function(data) {
  var date = new Date(data.timestamp);
  var timestamp = date.toISOString().slice(11, 19)
  return '<li class="collection-item message">' + '<strong>' + data.from + ' </strong><span class="body">' + data.message + '</span><span class="right grey-text text-lighten-1">' + timestamp + '</span></li>';
}
