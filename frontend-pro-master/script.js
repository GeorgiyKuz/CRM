const loader = document.getElementById("loader")
const clientsList = document.getElementById("clients")

let clients = []

function getClients() {
  fetch("http://localhost:3000/api/clients", {
    method: "GET"
  }).then(res => {
    res.json().then(data => {
      clients = data

      clients.forEach(client => {
        clientsList.innerHTML += clientItem(client)
      });

      setTimeout(() => {
        loader.style.display = "none"
        clientsList.style.display = "flex"
      }, 1000)
    })
  })
}

function clientItem({ id, createdAt, updatedAt, name, surname, lastName, contacts }) {
  return `
      <li class="main__list-item">
        ID: ${id}
        Фамилия Имя Отчество:  ${[name, surname, lastName].join(' ')}
        Дата и время создания: ${createdAt}
        Последние изменения: ${updatedAt}
        Контакты: ${contacts}
        Действия: изменить
      </li>
  `
}




getClients()