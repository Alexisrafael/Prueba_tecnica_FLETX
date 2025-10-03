import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['../auth.css']
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  //Se encarga de enviar los datos del formulario al backend para iniciar sesión
  onSubmit() {
    this.http.post('http://localhost:3001/login', {
      email: this.email,
      password: this.password
    }, { withCredentials: true })
    .subscribe({
      next: (res: any) => {
        console.log('Login ok:', res);

        //Redirige al dashboard SOLO si la respuesta indica login correcto
        if (res?.authenticated) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Login fallido';
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.error || 'Error en login';
      }
    });
  }
}
