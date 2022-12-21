const form = document.getElementById('todo-form');
const todoInput = document.getElementById('newtodo');
const todosList = document.getElementById('todos-list');
const noti = document.querySelector('.notification');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoID = -1;

renderTodo();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    saveTodo();
    renderTodo();
});

function saveTodo() {
    const todoValue = todoInput.value;

    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

    if (todoValue === '') {
        alert('todos empty')
    }
    else if (isDuplicate) {
        alert('todo exist')
    }
    else {
        if (EditTodoID >= 0) {
            todos = todos.map((todo, index) => {
                return {
                    ...todo,
                    value: index === EditTodoID ? todoValue : todo.value,
                }
            });
            EditTodoID = -1;
        }
        else {
            todos.push({
                value: todoValue,
                checked: false,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            });
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    todoInput.value = '';
}

function renderTodo() {
    todosList.innerHTML = '';

    todos.forEach((todo, index) => {
        todosList.innerHTML += `
             <div class="todo" id="${index}">
                <i 
                    class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}" 
                    style="color: ${todo.color}"
                    data-action="check"
                ></i>
                <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
                <i class="bi bi-pencil-square" data-action="edit"></i>
                <i class="bi bi-trash" data-action="delete"></i>
            </div> 
        `;
    });
}

todosList.addEventListener('click', (e) => {
    const target = e.target;
    const parentElement = target.parentNode;

    if (parentElement.className !== 'todo') return;

    const todo = parentElement;
    const toDoId = Number(todo.id);

    //target action
    const action = target.dataset.action;

    action === 'check' && checkTodo(toDoId);
    action === 'edit' && editTodo(toDoId);
    action === 'delete' && deleteTodo(toDoId);
});

function checkTodo(todoId) {
    todos = todos.map((todo, index) => {
        if (index === todoId) {
            return {
                ...todo,
                checked: !todo.checked
            }
        }
        else {
            return {
                ...todo,
                checked: todo.checked
            }
        }
    })
    renderTodo();
    localStorage.setItem('todos', JSON.stringify(todos));
}

function editTodo(todoId) {
    todoInput.value = todos[todoId].value;
    EditTodoID = todoId;
}

function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    //re-render
    renderTodo();
    localStorage.setItem('todos', JSON.stringify(todos));
}
