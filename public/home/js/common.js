var oldScroll = 0
document.addEventListener('scroll', function () {
  var navbar = document.querySelector('header')
  var mainbox = document.querySelector('.container')
  var scrollTop = document.documentElement.scrollTop
  if (scrollTop - oldScroll < 0) {
    navbar.style.visibility = 'visible'
    navbar.style.opacity = '1'
  } else {
    navbar.style.opacity = '0'
    navbar.style.visibility = 'hidden'
  }
  oldScroll = scrollTop

})
axios.defaults.baseURL = 'http://localhost/api/'
axios.interceptors.response.use(res => {
  return res.data
})
var setting = null
axios.get('setting').then(res => {
  setting = res.data
  var body=document.querySelector('body')
  var icon=document.querySelector('link[rel=icon]')
  body.style.backgroundImage=`url('${setting.bg}')`
  icon.setAttribute('href',setting.favicon)
})