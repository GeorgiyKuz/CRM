const loader = document.getElementById("loader")
const clientsList = document.getElementById("clients")
const addClientButton = document.getElementById('add-client-button');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const clientForm = document.getElementById("clientForm");
const addContactBtn = document.getElementById("addContactBtn");
const contactsList = document.getElementById("contactsList");
const headerSearch = document.getElementById("search-input")


let clients = []

function getClients() {
  fetch("http://localhost:3000/api/clients", {
    method: "GET"
  }).then(res => {
    res.json().then(data => {
      console.log(data)
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

const apiData = [
  { id: 1, fio: 'Иванов Иван Иванович', created: '2024-03-08 10:00', updated: '2024-03-08 10:30', contacts: ['+79001234567', 'ivan@example.com'] },
  { id: 2, fio: 'Петров Петр Петрович', created: '2024-03-07 15:00', updated: '2024-03-07 15:15', contacts: ['+79006543210'] },
  // ... другие данные
];

function displayClients(data) {
  clientsList.innerHTML = ''; // Очищаем список
  data.forEach(client => {
    const li = document.createElement('li');
    li.textContent = `${client.id} - ${client.fio} - ${client.created} - ${client.updated} - ${client.contacts.join(', ')}`;
    clientsList.appendChild(li);
  });
  loader.classList.remove('active');
}

function showLoader() {
    loader.classList.add('active');
}

function fetchData(searchQuery = '') {
    showLoader();
    // Здесь должен быть ваш код для запроса к API с учетом searchQuery
    // setTimeout(() => displayClients(apiData.filter(client => client.fio.toLowerCase().includes(searchQuery.toLowerCase()))), 500);
    console.log(searchQuery)
    fetch(`http://localhost:3000/api/clients/search=${searchQuery}`, {
      method: "GET"
    }).then(res => {
      return res.json().then(data => {
        clients = data
        console.log(data)
  
        // clients.forEach(client => {
          // clientsList.innerHTML += clientItem(client)
        // });
  
      })
    })
}

// Инициализация
fetchData();


searchInput.addEventListener('input', () => {
  setTimeout(() => fetchData(searchInput.value), 300);
});

let searchTimeout; //Для отмены таймаута


let currentClientId = null; // Используется для отслеживания редактируемого клиента

// Показать модальное окно
function openModal(title, client = {}) {
  modalTitle.textContent = title;
  clientForm.reset(); // Сброс формы
  contactsList.innerHTML = ''; // Очистка списка контактов

  // Заполнение формы, если редактируемый клиент
  if (client.id) {
    currentClientId = client.id;
    document.getElementById("clientName").value = client.name;
    document.getElementById("clientSurname").value = client.surname;
    document.getElementById("clientLastName").value = client.lastName || '';
    
    client.contacts.forEach(contact => {
      addContact(contact.type, contact.value);
    });
  } else {
    currentClientId = null; // Новая запись
  }

  modal.style.display = "block"; // Показать модальное окно
}

// Скрыть модальное окно
function closeModal() {
  modal.style.display = "none";
}

// Добавьте контакт в форму
addContactBtn.addEventListener('click', () => {
  addContact('', '');
});

// Функция добавления контакта
function addContact(type, value) {
  const contactDiv = document.createElement('div');
  contactDiv.innerHTML = `
    <input type="text" placeholder="Тип контакта" value="${type}" required>
    <input type="text" placeholder="Значение контакта" value="${value}" required>
    <button type="button" class="removeContactBtn">Удалить</button>
  `;
  contactsList.appendChild(contactDiv);

  // Удаление контакта
  contactDiv.querySelector('.removeContactBtn').addEventListener('click', () => {
    contactsList.removeChild(contactDiv);
  });
}

// Обработчик отправки формы
clientForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем стандартное поведение формы

  const clientData = {
    name: document.getElementById("clientName").value,
    surname: document.getElementById("clientSurname").value,
    lastName: document.getElementById("clientLastName").value,
    contacts: Array.from(contactsList.children).map(contactDiv => {
      const inputs = contactDiv.querySelectorAll('input');
      return {
        type: inputs[0].value,
        value: inputs[1].value,
      };
    })
  };

  if (currentClientId) {
    // Редактирование существующего клиента
    fetch(`http://localhost:3000/api/client/${currentClientId}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(getClients).then(closeModal);
  } else {
    // Создание нового клиента
    fetch("http://localhost:3000/api/clients", {
      method: 'POST',
      body: JSON.stringify(clientData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(getClients).then(closeModal);
  }
});

// Закрытие модального окна по нажатию на крестик
modal.querySelector('.modal__close').onclick = () => {
  closeModal();
}

// Закрытие модального окна при клике за его пределами
window.onclick = (event) => {
  if (event.target === modal) {
    closeModal();
  }
};

// Вызов функции открытия модального окна для добавления клиента
document.querySelector('.main__btn').onclick = () => {
  openModal('Добавить клиента');
};

// Обновление клиента через модальное окно
function editClient(client) {
  openModal('Изменить клиента', client);
}

// Обработайте действия редактирования и удаления в `clientItem` функции
function clientItem({ id, createdAt, updatedAt, name, surname, lastName, contacts }) {
  return `
      <li class="main__list-item">
        ID: ${id}
        Фамилия Имя Отчество:  ${[name, surname, lastName].join(' ')}
        Дата и время создания: ${createdAt}
        Последние изменения: ${updatedAt}
        Контакты: ${contacts.map(contact => `${contact.type}: ${contact.value}`).join(', ')}
        Действия: <button class="editBtn" data-id="${id}">Изменить</button>
        <button class="deleteBtn" data-id="${id}">Удалить</button>
      </li>
  `
}

// Добавьте обработку событий для кнопок редактирования и удаления
clientsList.addEventListener('click', (event) => {
  const id = event.target.dataset.id;
  
  if (event.target.classList.contains('editBtn')) {
    // Получить данные клиента для редактирования перед открытием модального окна
    fetch(`http://localhost:3000/api/client/${id}`)
      .then(res => res.json())
      .then(data => editClient(data));
  } else if (event.target.classList.contains('deleteBtn')) {
    // Удаление клиента
    if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
      fetch(`http://localhost:3000/api/client/${id}`, {
        method: 'DELETE',
      }).then(getClients);
    }
  }
});

function getClients(searchString = '') {
  loader.style.display = 'block';
  clientsList.innerHTML = '';

  fetch(`http://localhost:3000/api/clients?search=${searchString}`)
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then((data) => {
      clients = data;
      clientsList.innerHTML = '';
      clients.forEach(client => {
        clientsList.innerHTML += clientItem(client);
      });
      loader.style.display = 'none';
      clientsList.style.display = 'flex';
    })
    .catch(err => {
      console.error(err);
      alert('Не удалось загрузить данные о клиентах');
    });
}

let timeout;
headerSearch.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const searchQuery = headerSearch.value;
    getClients(searchQuery);
  }, 300);
});

// { name: string, surname: string, lastName?: string, contacts?: object[] }


const url = "http://localhost:3000"

const user = {
    name: "Георгий",
    surname: "Кузнецов",
    lastName: "Максимович",
    contacts: []
}

function postData(user) {
    const options = {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            'content-type': 'application/json'
        }
    }
    fetch(url + "/api/clients", options)
        .then((response) => { return response.json() })
        .then((result) => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}



function getData() {
    fetch(url + "/api/clients")
        .then((response) => { return response.json() })
        .then((result) => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}


// postData(user)
getData()

getClients()