$(function() {
  $('#name').keyup(function() {
    $('#greet').text('Hello ' + $('#name').val());
  });
});

console.log("popup.js loaded");