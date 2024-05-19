import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
};

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIDs.TodoList, todos );
        updatedPendingCount();
    };

    const updatedPendingCount = () => {
        renderPending( ElementIDs.PendingCountLabel );
    };

    // Cuando la funcion App() se llama
    (()=> {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector( elementId ).append( app );
        displayTodos();
    })();

    // Referencias HTML
    const newDescriptionInput = document.querySelector( ElementIDs.NewTodoInput );
    const todoListUL = document.querySelector( ElementIDs.TodoList );
    const clearCompletedButton = document.querySelector( ElementIDs.ClearCompleted );
    const filtersLIs = document.querySelectorAll( ElementIDs.TodoFilters );

    // Listeners
    newDescriptionInput.addEventListener('keyup', (e) => {
        if( e.keyCode !== 13 ) return;
        if( e.target.value.trim().length === 0 ) return;

        todoStore.addTodo( e.target.value );
        displayTodos();
        e.target.value = '';
    });

    todoListUL.addEventListener('click', (e) => {
        const element = e.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUL.addEventListener('click', (e) => {
        if(e.target.className !== 'destroy') return;

        const element = e.target.closest('[data-id]');
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();

    });

    clearCompletedButton.addEventListener('click', (e) => {
        todoStore.deleteCompletedTodo();
        displayTodos();
    });

    filtersLIs.forEach( element => {
        element.addEventListener('click', e => {
            filtersLIs.forEach( el => el.classList.remove('selected'));
            e.target.classList.add('selected');

            switch( e.target.text ) {
                case 'Todos':
                    todoStore.setFilter( Filters.All );
                break;

                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending );
                break;

                case 'Completados':
                    todoStore.setFilter( Filters.Completed );
                break;
            }

            displayTodos();
        });
    });
}