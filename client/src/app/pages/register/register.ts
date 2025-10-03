import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['../auth.css']
})
export class Register {
  name = '';
  lastname = '';
  email = '';
  password = '';
  age = '';
  address = '';
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  //Se encarga de enviar los datos del formulario al backend para registrar un nuevo usuario e iniciar sesión
  onSubmit() {
    this.http.post('http://localhost:3001/register', {
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      age: this.age,
      address: this.address,
    }, { withCredentials: true })
    .subscribe({
      next: (res: any) => {
        console.log('Registro ok:', res);
        this.success = 'Registro exitoso';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.error || 'Error en registro';
      }
    });
  }
}
