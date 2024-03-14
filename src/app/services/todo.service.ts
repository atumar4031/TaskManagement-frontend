import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}

  addTodo(payload: any) {
    const path = `${environment.baseUrl}${environment.addTask}`;

    return this.http.post<any>(path, payload);
  }

  getTodos(currentPage: number, itemsPerPage: number) {
    const path = `${environment.baseUrl}${environment.getpagesTasks}?page=${currentPage}&size=${itemsPerPage}`;

    return this.http.get(path);
  }

  editTodo(todoId: string, payload: any) {
    const path = `${environment.baseUrl}${environment.editTask}/${todoId}`;

    return this.http.put(path, payload);
  }

  fetchUser() {
    const path = `${environment.baseUrl}${environment.getUser}`;

    return this.http.get(path);
  }

  updateUser(userId: number, payload: any) {
    const path = `${environment.baseUrl}${environment.updateUser}/${userId}`;
    console.log(userId);

    return this.http.put(path, payload);
  }

  deleteTask(taskId: number) {
    const path = `${environment.baseUrl}${environment.deleteTask}/${taskId}`;

    return this.http.delete(path);
  }
}
