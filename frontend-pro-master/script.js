const loader = document.getElementById("loader")
const clientsList = document.getElementById("clients")
const mainTable = document.getElementById("main-table")

let clients = []

const  icons = [
  {name:'phone', url: './img/phone.png'},
  {name: 'email', url: './img/mail.png' },
  {name: 'VK', url: './img/vk.png'}
]



function getClients() {
  fetch("http://localhost:3000/api/clients", {
    method: "GET"
  }).then(res => {
    return res.json().then(data => {
      clients = data

      clients.forEach(client => {
        mainTable.innerHTML += clientItem(client)
      });

      afterRender()

      setTimeout(() => {
        loader.style.display = "none"
        clientsList.style.display = "flex"
      }, 1000)
    })
  })
}



function clientItem({ id, createdAt, updatedAt, name, surname, lastName, contacts }) {


  return `

      <tr class="test__firts-list">
                    <td class="test__id">${id + ' '}</td>
                    <td class="test__name">${name + ' ' + surname + ' ' + lastName}</td>
                    <td class="test__date-create">${createdAt}</td>
                    <td class="test__date-last__update">${updatedAt}</td>
                    <td class="test__contatc"><img class="iconContact" src="./img/phone.png" id="myButton"/>${contacts}</td>
                    <td><button class="test__button__change">Изменить</button></td>
                    <td><button class="test__button__delete">Удалить</button></td>
                </tr>
  `
}


getClients()

function afterRender() {
  let icons = document.querySelectorAll('.iconContact')
  for (let i = 0; i < icons.length; i++) {
    tippy(icons[i], {
      content: 'Hello',
      
    });
  }
}

contacts.find(contact => contact.type === "Телефон").value;

