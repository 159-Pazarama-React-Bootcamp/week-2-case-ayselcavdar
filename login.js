// Selectors 
const loginInput = document.getElementById('loginInput')
const loginBtn = document.getElementById('loginBtn')


// Events
// window tamamen yuklendiginde o anki sayfanın url originini alıp
// daha sonra local storage'da username'in olup olmadıgını check ederek
// kullanıcıyı ana sayfaya yonlendiriyoruz
window.onload = function() {
    const urlOrigin = location.origin
    const username = localStorage.getItem('USERNAME')
    if(username) location.href = `${urlOrigin}/index.html`;
}
// Events
// burada kullanıcı login iconuna tıkladıgında girdigi username
// check ettikten sonra localstorage kaydetip ana sayfaya yonlendiriyoruz

loginBtn.addEventListener('click', function(){
    const username = loginInput.value
    localStorage.setItem('USERNAME', JSON.stringify(username))
    if (username) location.href = `${urlOrigin}/index.html`;
})