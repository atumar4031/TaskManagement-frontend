import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  newTodo: any = {
    title: '',
    description: '',
    dueDate: '',
    priority: '',
  };

  sortedBy: string = 'priority'; // Default sorting by priority
  filters: { priority?: number; completed?: boolean } = {};

  currentPage = 0;
  totalPages = 5;
  itemsPerPage = 5;
  todos: any[] = [];

  editingTodoId: number | null = null;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  addTodo(todoForm: NgForm): void {
    // Format the dueDate before sending it in the payload
    const formattedTodo = {
      ...todoForm.value,
      dueDate: this.formatDate(todoForm.value.dueDate),
    };

    this.todoService.addTodo(formattedTodo).subscribe((res) => {
      console.log(res);
      this.loadTodos();
    });
  }

  loadTodos(): void {
    this.todoService
      .getTodos(this.currentPage, this.itemsPerPage)
      .subscribe((data: any) => {
        this.todos = data.result;

        // Sort todos based on sortedBy property
        if (this.sortedBy === 'priority') {
          this.todos.sort((a, b) =>
            this.comparePriority(a.priority, b.priority)
          );
        } else if (this.sortedBy === 'dueDate') {
          this.todos.sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
        }

        this.totalPages = data.totalPages;
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTodos();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTodos();
    }
  }

  EditTodo(todoId: number): void {
    this.editingTodoId = todoId;
  }

  logout() {
    this.auth.logOut().subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'Logout failed', 'Error');
      },
    });
  }

  deleteTask(todoId: number) {
    this.todoService.deleteTask(todoId).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        this.todoService
          .getTodos(this.currentPage, this.itemsPerPage)
          .subscribe({
            next: (res: any) => {
              this.todos = res.result;
            },
            error: () => {},
          });
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'An error occurred', 'Error');
      },
    });
  }
  saveTodoEdits(todoId: number, todo: any): void {
    const editedTodoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    if (editedTodoIndex !== -1) {
      this.todos[editedTodoIndex].title = todo.title;
      this.todos[editedTodoIndex].description = todo.description;
      // this.todos[editedTodoIndex].dueDate = todo.dueDate;
      this.todos[editedTodoIndex].priority = todo.priority;

      const payload = {
        title: this.todos[editedTodoIndex].title,
        description: this.todos[editedTodoIndex].description,
        status: this.todos[editedTodoIndex].status,
        dueDate: this.formatDate(this.todos[editedTodoIndex].dueDate),
        priority: this.todos[editedTodoIndex].priority,
      };

      this.todoService
        .editTodo(this.todos[editedTodoIndex].id, payload)
        .subscribe((res) => {
          console.log(res);
        });
      console.log(payload);
      this.editingTodoId = null;
    }
  }

  cancelEdit(): void {
    this.editingTodoId = null;
  }

  deleteTodo(todoId: number): void {
    const deletedTodoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    if (deletedTodoIndex !== -1) {
      this.todos.splice(deletedTodoIndex, 1);
    }
  }

  private generateId(): number {
    return this.todos.length > 0
      ? Math.max(...this.todos.map((todo) => todo.id)) + 1
      : 1;
  }

  formatDate(dateString: string): string {
    // Parse the dateString into a Date object
    const dateObject = new Date(dateString);

    // Extract the year, month, day, hours, and minutes components from the Date object
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Note: getMonth() returns zero-based month
    const day = dateObject.getDate();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    // Construct the formatted date string in "YYYY-MM-DD HH:mm" format
    const formattedDate = `${year}-${this.padZero(month)}-${this.padZero(
      day
    )} ${this.padZero(hours)}:${this.padZero(minutes)}`;

    return formattedDate;
  }

  padZero(num: number): string {
    // Add leading zero if the number is less than 10
    return num < 10 ? `0${num}` : `${num}`;
  }

  comparePriority(priorityA: string, priorityB: string): number {
    const priorityOrder: { [key: string]: number } = {
      High: 3,
      Medium: 2,
      Low: 1,
    };
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
