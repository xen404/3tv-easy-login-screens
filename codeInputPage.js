const inputFields = [...document.querySelectorAll('input.code-input')]

inputFields.forEach((inputField, index)=>{
  inputField.addEventListener('keydown',(e)=>{
    // if the keycode is backspace & the current field is empty
    // focus the input before the current. Then clear the previous input box.
    if(e.keyCode === 8 && e.target.value==='') inputFields[Math.max(0,index-1)].focus()
  })
  inputField.addEventListener('input',(e)=>{
    const [first,...rest] = e.target.value.toUpperCase()
    e.target.value = first ?? '' 

    const lastInputBox = index===inputFields.length-1
    const didInsertContent = first!==undefined

    if(didInsertContent && !lastInputBox) {
      inputFields[index+1].focus()
      inputFields[index+1].value = rest.join('')
      inputFields[index+1].dispatchEvent(new Event('input'))
    }
  })
})

document.getElementById('code-form').addEventListener('submit', function(e) {
    e.preventDefault();
    onSubmit(e);
  });
  

  function onSubmit(e) {
    e.preventDefault();
    
    const codeInputs = document.querySelectorAll('.code-input');
    const code = Array.from(codeInputs).map(input => input.value).join('');

    const apiUrl = 'https://easylogin.dreitv.dev.k8s.internal/verify_code';
    const queryParams = `?user_code=${encodeURIComponent(code)}`;
    const url = apiUrl + queryParams;

    const form = document.getElementById('code-form');
    form.setAttribute('action', url);
    form.submit();
}

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('error')) {
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'Der Kopplungscode wurde falsch eingegeben. Bitte geben Sie den Kopplungscode erneut ein.';
  errorMessage.classList.add('error-message');

  const contentSection = document.querySelector('.content');
  contentSection.insertBefore(errorMessage, contentSection.querySelector('.content-title').nextSibling);
}
