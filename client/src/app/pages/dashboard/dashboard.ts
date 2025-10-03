import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  user: any = null;
  tasks: any[] = [];
  newTitle: string = '';
  newDescription: string = '';
  loading: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  //Se encarga de validar si el usuario tiene una sesión activa
  ngOnInit() {
    this.http.get('http://localhost:3001/me', { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.user = res.user || res
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error en dashboard:', err);
          this.router.navigate(['/login']);
        }
      });
    
  }

   // Traer tareas del usuario
  loadTasks() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3001/tasks', { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.tasks = res || []; 
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar tareas:', err);
          this.tasks = [];
          this.loading = false;
        }
      });
  }

  // Crear nueva tarea
  createTask() {
    if (!this.newTitle || !this.newDescription) return alert('Todos los campos son obligatorios');

    this.http.post('http://localhost:3001/createtask', 
      { title: this.newTitle, description: this.newDescription }, 
      { withCredentials: true })
      .subscribe({
        next: () => {
          this.newTitle = '';
          this.newDescription = '';
          this.loadTasks();
        },
        error: (err) => console.error('Error al crear tarea:', err)
      });
  }

  // Eliminar tarea
  deleteTask(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;

    this.http.delete(`http://localhost:3001/tasks/${id}`, { withCredentials: true })
      .subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Error al eliminar tarea:', err)
      });
  }

  //Se encarga de cerrar la sesión del usuario
  logout() {
    this.http.post('http://localhost:3001/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}

